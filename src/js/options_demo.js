//pops up a modal where we can build a new rule
$("#addDemoRules").click(function () {
    chrome.storage.sync.get(null, function (data) {
        rules = data.rules;

        var demoRules = [
            {
                "name": "Git Repo",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Find publicly accessible .git repos",
                "url": ".git/HEAD",
                "searchString": "ref:",
                "risk": "medium"
            },
            {
                "name": "Git Repo (Indexable)",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Find index-listing .git dirs",
                "url": ".git",
                "searchString": "Index of",
                "risk": "low"
            },
            {
                "name": "SVN Repo",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Find publicly accessible SVN dirs",
                "url": ".svn/entries",
                "searchString": "svn:",
                "risk": "medium"
            },
            {
                "name": "SVN Repo (Indexable)",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Find index listing SVN dirs",
                "url": ".svn",
                "searchString": "Index of",
                "risk": "low"
            },
            {
                "name": "Unix /etc/passwd",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Web accessible /etc/password files",
                "url": "../../../../../../../../etc/passwd",
                "searchString": ":",
                "risk": "high"
            },
            {
                "name": "Unix /etc/shadow",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Web ",
                "url": "../../../../../../../../etc/shadow",
                "searchString": ":",
                "risk": "high"
            }
        ];

        //push the new rules in
        for (var i = 0; i < demoRules.length; i++) {
            rules.push(demoRules[i]);
        }

	chrome.storage.sync.set({
            'rules': rules
        }, function(){
	    $('#addRuleModal').modal('hide');
	    showNotification("success", "Rule added.");
	    populateRuleTable();
	    alert("Some of the demo exploits can get you into trouble if you run them on the wrong domain. Please carefully review them before running Bishop.")
	});
    });
});