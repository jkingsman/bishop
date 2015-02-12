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
                "searchString": "ref: (refs|[0-9a-fA-F]+)",
                "risk": "medium"
            },
            {
                "name": "Git Repo (Indexable)",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Find index-listing .git dirs",
                "url": ".git",
                "searchString": "Index of(.|\n)*HEAD",
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
                "searchString": "Index(.|\n)*entries",
                "risk": "low"
            },
            {
                "name": "eval'ing a Variable",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Find JS eval's that concatenate",
                "url": "",
                "searchString": "eval(\s|)\\((\"|').*(\"|')(\s|)\+", //note that the double quotes in this are escaped; the original regex is eval(\s|)\(("|').*("|')(\s|)\+
                "risk": "medium"
            },
	    {
                "name": "Web Accessible php.exe",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Finds directory listings that include php.exe",
                "url": "",
                "searchString": "Index(.|\n)*modified(.|\n)*php\.exe",
                "risk": "medium"
            },
	    {
                "name": "Web Accessible php.exe 2",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Finds directory listings that include php.exe",
                "url": "php5",
                "searchString": "Index(.|\n)*modified(.|\n)*php\.exe",
                "risk": "medium"
            },
	    {
                "name": "OWA Login",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Find Outlook Web Access log ins",
                "url": "owa",
                "searchString": "Connected to Microsoft Exchange",
                "risk": "medium"
            },
	    {
                "name": "OWA Login 2",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Find Outlook Web Access log ins",
                "url": "mail",
                "searchString": "Connected to Microsoft Exchange",
                "risk": "medium"
            },
            {
                "name": "phpMyAdmin Setup",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Accessible phpMyAdmin setup page",
                "url": "phpmyadmin/scripts/setup.php",
                "searchString": "You want to configure phpMyAdmin",
                "risk": "medium"
            },
            {
                "name": "Typo3 phpMyAdmin Setup",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Accessible phpMyAdmin setup page on Typo3",
                "url": "typo3/phpmyadmin/scripts/setup.php",
                "searchString": "You want to configure phpMyAdmin",
                "risk": "medium"
            },
            {
                "name": "phpMyAdmin Setup (alt. name 1)",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Accessible phpMyAdmin setup page (alt. name)",
                "url": "php/scripts/setup.php",
                "searchString": "You want to configure phpMyAdmin",
                "risk": "medium"
            },
	    {
                "name": "phpMyAdmin Setup (alt. name 2)",
                "uid": Math.floor(Math.random() * 16777215).toString(16),
                "enabled": true,
                "description": "Accessible phpMyAdmin setup page (alt. name)",
                "url": "phpma/scripts/setup.php",
                "searchString": "You want to configure phpMyAdmin",
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