function populateRuleTable() {
    var rule, riskClass, riskText;
    var totalCount = 0,
        activeCount = 0;

    $('#rulesTableBody').empty();
    chrome.storage.sync.get(null, function (data) {
        //populate the table
        for (var i = 0; i < data.rules.length; i++) {
            rule = data.rules[i];

            totalCount++;
            if (rule.enabled) {
                activeCount++;
            }

            switch (rule.risk) {
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
            }

            //append the URL to the table
            $('#rulesTableBody').append('<tr><td><input type="checkbox" id="ruleEnabled' + rule.uid + '"></td><td class="' + riskClass + '">' + riskText + '</td><td>' + rule.name + '</td><td>' + rule.description + '</td><td>' + rule.url + '</td><td>' + rule.searchString + '</td><td class="text-center"><a href="#" id="delRule' + rule.uid + '"><i class="glyphicon glyphicon-trash"></i></a></td></tr>');
        }

        //check or uncheck as appropriate
        handleCheckboxes(data.rules);

        //set our counts
        $('#ruleCount').html("(" + activeCount + " of " + totalCount + " rules enabled; " + (activeCount * data.config.xhrDelay) + " seconds to process all)");

        //let the user know if we don't have any sites stored
        if (data.rules.length < 1) {
            $('#rulesTableBody').append('<tr><td colspan=7>No rules added yet!</td></tr>');
        }
    });
}

//erase sites from the table and from storage
$("#deleteAllRules").click(function () {
    var confirmed = confirm("This will delete all rules.");
    if (confirmed) {
        chrome.storage.sync.set({
            "rules": []
        }, function () {
            showNotification("success", "Rule list cleared.");
        });
    }
});

//iterates through all checkbox
function handleCheckboxes(rules) {
    //loop through and check
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (rule.enabled) {
            $("#ruleEnabled" + rule.uid).prop("checked", true);
        } else {
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
        }, function () {
            $('#addRuleModal').modal('hide');
            showNotification("success", "Rule added.");
            $("#addRuleForm")[0].reset();
        });
    });
});

//hook the delete rule link (have to do this a bit funky since they're dynamically added)
$(document.body).on("click", "[id^=delRule]", function () {
    //extract the UID from the element ID
    var id = this.id.replace(/delRule/g, '');

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
        }, function () {
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
        }, function () {
            showNotification("success", "Rule status changed.");
        });
    });
});

//pops up a modal with the JSON of the rules in it
$("#exportRule").click(function () {
    chrome.storage.sync.get(null, function (data) {
        var rules = data.rules;
        $("#exportRuleBox").val(JSON.stringify(rules));
        $('#exportRuleModal').modal('show');
    });
});

//pops up a modal with the JSON of the vulnerable sites in it
$("#importRule").click(function () {
    var importRule, rule;
    var confirmed = confirm("This will import the current contents of the textarea; badly formed data will cause problems. Please reference the export format for the correct import format.");
    if (confirmed) {
        importData = jQuery.parseJSON($("#exportRuleBox").val());
        chrome.storage.sync.get(null, function (data) {
            for (var i = 0; i < importData.length; i++) {
                rule = importData[i];
                data.rules.push(rule);
            }
            chrome.storage.sync.set({
                'rules': data.rules
            }, function () {
                showNotification("success", "Rules loaded.");
                $('#exportRuleModal').modal('hide');
            });
        });
    }
    return false;
});

//deal with any of the enable buttons
$(document.body).on("click", "[id^=bulkEnable]", function () {
    var selector = this.id.replace(/bulkEnable/g, '');
    var i, rule;

    chrome.storage.sync.get(null, function (data) {
        rules = data.rules;

        switch (selector) {
            case "All":
                for (i = 0; i < rules.length; i++) {
                    rule = rules[i];
                    rules[i].enabled = true;
                }
                break;
            case "Low":
                for (i = 0; i < rules.length; i++) {
                    rule = rules[i];
                    if (rules[i].risk == "low") {
                        rules[i].enabled = true;
                    }
                }
                break;
            case "Medium":
                for (i = 0; i < rules.length; i++) {
                    rule = rules[i];
                    if (rules[i].risk == "medium") {
                        rules[i].enabled = true;
                    }
                }
                break;
            case "High":
                for (i = 0; i < rules.length; i++) {
                    rule = rules[i];
                    if (rules[i].risk == "high") {
                        rules[i].enabled = true;
                    }
                }
                break;
        }

        chrome.storage.sync.set({
            "rules": rules
        }, function () {
            handleCheckboxes(data.rules);
            showNotification("success", "Rule status changed.");
        });
    });
    
    return false;
});

//deal with any of the disable buttons
$(document.body).on("click", "[id^=bulkDisable]", function () {
    var i, rule;
    var selector = this.id.replace(/bulkDisable/g, '');

    chrome.storage.sync.get(null, function (data) {
        rules = data.rules;

        switch (selector) {
            case "All":
                for (i = 0; i < rules.length; i++) {
                    rule = rules[i];
                    rules[i].enabled = false;
                }
                break;
            case "Low":
                for (i = 0; i < rules.length; i++) {
                    rule = rules[i];
                    if (rules[i].risk == "low") {
                        rules[i].enabled = false;
                    }
                }
                break;
            case "Medium":
                for (i = 0; i < rules.length; i++) {
                    rule = rules[i];
                    if (rules[i].risk == "medium") {
                        rules[i].enabled = false;
                    }
                }
                break;
            case "High":
                for (i = 0; i < rules.length; i++) {
                    rule = rules[i];
                    if (rules[i].risk == "high") {
                        rules[i].enabled = false;
                    }
                }
                break;
        }

        chrome.storage.sync.set({
            "rules": rules
        }, function () {
            handleCheckboxes(data.rules);
            showNotification("success", "Rule status changed.");
        });
    });
    
    return false;
});