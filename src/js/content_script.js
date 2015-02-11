//make this a global wince we're going to be accessing it a lot
var rules, config;

//the meat of the content script
chrome.storage.sync.get(null, function (data) {
    rules = data.rules;
    config = data.config;
    if (data.status) {
        if (config.xhrDelay) {
            setTimeout(function () {
                doScan(config.recursive);
            }, 5000);
        } else {
            doScan(config.recursive);
        }
    }
});

//recurse through the directories and perform the scans


function doScan(recursive) {
    //the extension is enabled
    var currentScanUrl = stripTrailingSlash(window.location.href);

    if (config.exclusionList.length > 0) {
        //we have an exclusion list to work with; break it out
        var excludes = config.exclusionList.split("::");
        for (var i = 0; i < excludes.length; i++) {
            if (currentScanUrl.indexOf(excludes[i]) > -1 && excludes[i].length > 0) {
                //this page contains a blocked url string and it's not an empty string; get outta here
                return;
            }
        }
    }

    if (recursive) {
        //keep processing URLs, including the current one and all parents, until we can't anymore
        while (currentScanUrl != -1) {
            scanURL(currentScanUrl);
            currentScanUrl = nextParent(currentScanUrl);
        }
    } else {
        //not recursing; just test the current location
        scanURL(currentScanUrl);
    }
}

//scan a given URL with all of our rules


function scanURL(url) {
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];

        if (rule.enabled) {
            if (upAndHas(url + "/" + rule.url, rule.searchString)) {
                addSiteAndAlert(url, rule.name);
            }
        }
    }
}

//add a site onto the sites list and alert the user


function addSiteAndAlert(url, rule) {
    var sites;
    //pull our site list out of storage
    chrome.storage.sync.get(null, function (data) {
        sites = data.sites;

        //make sure we're not duplicating; get out if we are.
        for (var i = 0; i < sites.length; i++) {
            var site = sites[i];
            if (site.url == url && site.rule == rule) {
                return;
            }
        }

        //push the current URL onto the array
        sites.push({
            "uid": Math.floor(Math.random() * 16777215).toString(16),
            "url": url,
            "rule": rule
        });

        //send it to the great gig in the sky
        chrome.storage.sync.set({
            'sites': sites
        });

        //alert the user
        if (config.soundFound) {
            var audio = new Audio(chrome.extension.getURL('/audio/alert.mp3'));
            audio.play();
        }

        if (config.alertFound) {
            //the timeout is here due to some weird issue where, without a timeout, alert dismissal is required before the audio plays
            //I'm guessing it's some issue with async processes getting blocked but who knows. this seems to fix it.
            setTimeout(function () {
                alert('&#9821; Bishop matched your rule ' + rule + ' at ' + url);
            }, 500);
        }

        if (config.alertCSSFound) {
            //install our CSS
            var style = document.createElement('link');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            style.href = chrome.extension.getURL('css/alert.css');
            (document.head || document.documentElement).appendChild(style);

            //insert the alert itself
            document.body.insertAdjacentHTML('afterBegin', '<div id="note">&#9821; Bishop matched your rule "' + rule + '". (Refresh page to dismiss)</div>');
        }
    });
}

//strip the trailing slash if there is one
//returns the next parent URL, or -1 if there is none
//e.g. nextParent("http://exmaple.com/dir/file.html") returns "http://exmaple.com/dir".
//e.g. nextParent("http://exmaple.com/") returns -1.


function nextParent(url) {
    //sanitize so that the last occurence of the slash isn't a terminating slash
    stripTrailingSlash(url);

    //grab from the beginning of the URL to the last occurence of the slash
    url = url.substr(0, url.lastIndexOf("/"));

    //the downside is that this trimming will mangle the URL if we're already at root
    //usually we're left with 'http:/' or 'https:/'; we'll assume we need at least 8 chars to be valid
    if (url.length < 9) {
        return -1;
    } else {
        return url;
    }
}

//returns true if the url responds 200 and the responsebody contains string
//use to just check for 200


function upAndHas(url, string) {
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send();

    if (req.status == 200) {
        if (req.responseText.indexOf(string) > -1) {
            return true;
        }
        return false;
    }
}

function stripTrailingSlash(url) {
    if (url.substr(-1) == '/') {
        return url.substr(0, url.length - 1);
    }

    return url;
}