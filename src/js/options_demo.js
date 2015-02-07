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
                "name": "phpMyAdmin Setup",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Accessible phpMyAdmin setup page",
                "url": "phpmyadmin/scripts/setup.php",
                "searchString": "phpMyAdmin",
                "risk": "medium"
            },
            {
                "name": "Typo3 phpMyAdmin Setup",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Accessible phpMyAdmin setup page on Typo3",
                "url": "typo3/phpmyadmin/scripts/setup.php",
                "searchString": "phpMyAdmin",
                "risk": "medium"
            },
            {
                "name": "phpMyAdmin Setup (alt. name 1)",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Accessible phpMyAdmin setup page (alt. name)",
                "url": "phpadmin/scripts/setup.php",
                "searchString": "phpMyAdmin",
                "risk": "medium"
            },
	    {
                "name": "phpMyAdmin Setup (alt. name 2)",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Accessible phpMyAdmin setup page (alt. name)",
                "url": "phpma/scripts/setup.php",
                "searchString": "phpMyAdmin",
                "risk": "medium"
            },
            {
                "name": "phpMyAdmin Setup (alt. name 3)",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Accessible phpMyAdmin setup page (alt. name)",
                "url": "admin/scripts/setup.php",
                "searchString": "phpMyAdmin",
                "risk": "medium"
            },
            {
                "name": "phpMyAdmin Setup (alt. name 4)",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Accessible phpMyAdmin setup page (alt. name)",
                "url": "db/scripts/setup.php",
                "searchString": "phpMyAdmin",
                "risk": "medium"
            },
            {
                "name": "TimThumb 1",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "TimThumb",
                "url": "timthumb.php",
                "searchString": "TimThumb",
                "risk": "medium"
            },
            {
                "name": "TimThumb 2",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "TimThumb",
                "url": "thumb.php",
                "searchString": "TimThumb",
                "risk": "medium"
            },
            {
                "name": "Unix /etc/passwd",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": false,
                "description": "Web accessible /etc/password file (doesn't work with XHR; disabled by default)",
                "url": "../../../../../../../../etc/passwd",
                "searchString": ":",
                "risk": "high"
            },
	    {
                "name": "Unix /etc/passwd 2",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": false,
                "description": "Web accessible /etc/password file (URL encoded)",
                "url": "%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
                "searchString": ":",
                "risk": "high"
            },
            {
                "name": "Unix /etc/shadow",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": false,
                "description": "Web accessible /etc/shadow file (doesn't work with XHR; disabled by default)",
                "url": "../../../../../../../../etc/shadow",
                "searchString": ":",
                "risk": "high"
            },
            {
                "name": "Cisco/Linksys tmUnblock.cgi",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": false,
                "description": "Exploitable router control file (no string to search for so too many false positives; disabled by deaault)",
                "url": "Cisco/Linksys tmUnblock.cgi",
                "searchString": "",
                "risk": "medium"
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