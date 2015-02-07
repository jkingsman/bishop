function populateRuleTable() {
    $('#rulesTableBody').empty();
    chrome.storage.sync.get(null, function (data) {
        //populate the table
        for (var i = 0; i < data.rules.length; i++) {
            var rule = data.rules[i], riskClass, riskText;

            switch(rule.risk) {
                case "low":
                    riskClass = "bg-success";
                    riskText = "Low";
                    break;
                case "medium":
                    riskClass = "bg-warning";
                    riskText = "Medium";
                    break;
                case "high":
                    riskClass = "bg-danger";
                    riskText = "High";
                    break;
                default:
                    riskClass = "bg-primary";
                    riskText = "Unspecified";
            };

            //append the URL to the table
            $('#rulesTableBody').append('<tr><td><input type="checkbox" id="ruleEnabled' + rule.uid + '"></td><td class="' + riskClass + '">' + riskText + '</td><td>' + rule.name + '</td><td>' + rule.description + '</td><td>' + rule.url + '</td><td>' + rule.searchString + '</td><td class="text-center"><a href="#" id="delRule' + rule.uid + '"><i class="glyphicon glyphicon-trash"></i></a></td></tr>');
        }

        //check or uncheck as appropriate
        handleCheckboxes(data.rules);

        //let the user know if we don't have any sites stored
        if (data.rules.length < 1) {
            $('#rulesTableBody').append('<tr><td colspan=7>No rules added yet!</td></tr>');
        }
    });
}

//iterates through all checkbox
function handleCheckboxes(rules) {
    //loop through and check
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (rule.enabled) {
            $("#ruleEnabled" + rule.uid).prop("checked", true);
        } else{
            $("#ruleEnabled" + rule.uid).prop("checked", false);
        }
    }
}

//pops up a modal where we can build a new rule
$("#addRule").click(function () {
    $('#addRuleModal').modal('show');
});

//pops up a modal where we can build a new rule
$("#saveRule").click(function () {
    if (!$("#addRuleForm")[0].checkValidity()) {
        alert("Please fill in at least an URL and a Name.");
        return;
    }

    chrome.storage.sync.get(null, function (data) {
        rules = data.rules;

        //push the current rule onto the array
        rules.push({
            "enabled": true,
            "uid": Math.floor(Math.random() * 16777215).toString(16),
            "name": $("#ruleName").val(),
            "description": $("#ruleDesc").val(),
            "url": $("#existenceURL").val(),
            "searchString": $("#urlBody").val(),
            "risk": $('input[name=risk]:checked').val()
        });

	chrome.storage.sync.set({
            'rules': rules
        }, function(){
	    $('#addRuleModal').modal('hide');
	    showNotification("success", "Rule added.");
	    populateRuleTable();
            $("#addRuleForm")[0].reset();
	});
    });
});

//hook the delete rule link (have to do this a bit funky since they're dynamically added)
$(document.body).on("click", "[id^=delRule]", function () {
    //extract the UID from the element ID
    var id = this.id.replace(/delRule/g, '')

    chrome.storage.sync.get(null, function (data) {
        rules = data.rules;

        //loop through the ID's and find our ID
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            if (rule.uid == id) {
                rules.splice(i, 1);
            }
        }

        chrome.storage.sync.set({
            "rules": rules
        }, function(){
	    //redraw
	    populateRuleTable();
	    showNotification("warning", "Rule deleted.");
	});
    });
});

//hook the enable/disable checkboxes
$(document.body).on("click", "[id^=ruleEnabled]", function () {
    //extract the UID from the element ID
    var id = this.id.replace(/ruleEnabled/g, '');
    chrome.storage.sync.get(null, function (data) {
        rules = data.rules;

        //loop through the ID's and find our ID
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            if (rule.uid == id) {
                rules[i].enabled = $("#ruleEnabled" + rule.uid).prop("checked");
            }
        }

        chrome.storage.sync.set({
            "rules": rules
        }, function(){
	    showNotification("success", "Rule status changed.");
	});
    });
});

//deal with any of the enable buttons
$(document.body).on("click", "[id^=bulkEnable]", function () {
    var selector = this.id.replace(/bulkEnable/g, '');

     chrome.storage.sync.get(null, function (data) {
        rules = data.rules;

        switch(selector) {
            case "All":
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    rules[i].enabled = true;
                }
                break;
            case "Low":
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    if (rules[i].risk == "low") {
                        rules[i].enabled = true;
                    }
                }
                break;
            case "Medium":
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    if (rules[i].risk == "medium") {
                        rules[i].enabled = true;
                    }
                }
                break;
            case "High":
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    if (rules[i].risk == "high") {
                        rules[i].enabled = true;
                    }
                }
                break;
        };

        chrome.storage.sync.set({
            "rules": rules
        }, function(){
            handleCheckboxes(data.rules);
	    showNotification("success", "Rule status changed.");
	});

    });
});

//deal with any of the disable buttons
$(document.body).on("click", "[id^=bulkDisable]", function () {
    var selector = this.id.replace(/bulkDisable/g, '');

     chrome.storage.sync.get(null, function (data) {
        rules = data.rules;

        switch(selector) {
            case "All":
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    rules[i].enabled = false;
                }
                break;
            case "Low":
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    if (rules[i].risk == "low") {
                        rules[i].enabled = false;
                    }
                }
                break;
            case "Medium":
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    if (rules[i].risk == "medium") {
                        rules[i].enabled = false;
                    }
                }
                break;
            case "High":
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    if (rules[i].risk == "high") {
                        rules[i].enabled = false;
                    }
                }
                break;
        };

        chrome.storage.sync.set({
            "rules": rules
        }, function(){
            handleCheckboxes(data.rules);
	    showNotification("success", "Rule status changed.");
	});

    });
});