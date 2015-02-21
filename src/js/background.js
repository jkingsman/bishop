//just to make sure we're all initialized on first run
chrome.storage.sync.get(null, function (data) {
    if (typeof data.config === "undefined" || typeof data.sites === "undefined" || typeof data.rules === "undefined" || typeof data.status === "undefined" || typeof data.queue === "undefined") {
        //default config
        config = {
            recursive: true,
            soundFound: true,
            alertFound: false,
            alertCSSFound: true,
            xhrDelay: 5,
            enableQueue: false,
            exclusionList: "google.com::facebook.com::reddit.com::amazon.com::chrome-extension" //high traffic sites with either lots of false positives or definitely no weakness that this would catch
        };

        //only create a new sites if we don't have it yet; don't want to overwrite people's on update
        if (typeof data.sites === "undefined") {
            chrome.storage.sync.set({
                "sites": [],
            });
        }

        //only create a new rules if we don't have it yet; don't want to overwrite people's on update
        if (typeof data.rules === "undefined") {
            chrome.storage.sync.set({
                "rules": [],
            });
        }

        //only init the queue if it's not already
        if (typeof data.queue === "undefined") {
            chrome.storage.sync.set({
                "queue": [],
            });
        }

        //store the defaults
        chrome.storage.sync.set({
            "config": config,
            "seenSites": 0,
            "status": 1,
        });
    }
});

setInterval(function () {
    var newCount;
    chrome.storage.sync.get(null, function (data) {
        //compare the number of sites we saw last time we checked vs now. if greater; show a badge.
        newCount = data.sites.length - data.seenSites;
        if (newCount > 0) {
            chrome.browserAction.setBadgeText({
                text: newCount.toString()
            });
        } else {
            chrome.browserAction.setBadgeText({
                text: ""
            });
        }
    });
}, 2000);