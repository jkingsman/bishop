buildPage();

//main function that populates option boxes and the site list
function buildPage() {
    var config, sites, enabled;

    chrome.storage.sync.get(null, function (data) {
        chrome.storage.sync.set({
            'seenSites': data.sites.length
        });

        config = data.config;
        sites = data.sites;
        enabled = data.status;

        //set our checkboxes to what's in storage
        $("#enabled").prop("checked", enabled);
        $("#recursive").prop("checked", config.recursive);

        $("#soundFound").prop("checked", config.soundFound);
        $("#alertFound").prop("checked", config.alertFound);
        $("#alertCSSFound").prop("checked", config.alertCSSFound);

        $("#xhrDelay").val(config.xhrDelay);
        $("#inclusionRegex").val(config.inclusionRegex);

        //set a delay so we don't cause issues on the first draw
        setTimeout(function () {
            populateRuleTable();
            populateSiteTable();
        }, 500);


        //be loud if it's disabled
        if (!enabled) {
            showNotification("danger", "Bishop is currently disabled.");
        }
        
        //add the inclusion field if we don't have it
        if (typeof data.config.inclusionRegex === "undefined") {
            chrome.storage.sync.set({
                'inclusionRegex': "examplesitename"
            });
        }
        
        //show our demo if we haven't
        if (typeof data.introShown === "undefined") {
            startIntro();
            chrome.storage.sync.set({
                'introShown': true
            });
        }
        
    });
}

//show notifications
//style is a bootstrap alert class sans the 'alert-'
//content is the message to display
function showNotification(notifyType, notifyContent) {
    $.notify(
        {
            message: notifyContent,
            title: notifyType.charAt(0).toUpperCase() + notifyType.slice(1) + "!"
        },
        {
            type: 'minimalist',
            delay: 5000,
            template: '<div data-notify="container" class="col-xs-11 col-sm-2 alert alert-' + notifyType + ' alert-{0}" role="alert">' +
                    '<span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span>' +
            '</div>'
        }
    );
}

/*
 * Begin Event Listeners
 */

$("[name^=config]").on('change', function () {
    //build out an array of config options
    var config = {
        recursive: $("#recursive").prop("checked"),

        soundFound: $("#soundFound").prop("checked"),
        alertFound: $("#alertFound").prop("checked"),
        alertCSSFound: $("#alertCSSFound").prop("checked"),

        xhrDelay: $("#xhrDelay").val(),
        inclusionRegex: $("#inclusionRegex").val()

    };

    //store config
    chrome.storage.sync.set({
        'config': config,
        'status': $("#enabled").prop("checked")
    });

    //notify
    showNotification("success", "Configuration updated.");
});

//play the ding for the user
$("#demoSound").click(function () {
    var audio = new Audio('/audio/alert.mp3');
    audio.play();
});

//show what the alert looks like
$("#demoAlert").click(function () {
    alert("This site has a publically accessible Git repo.");
});

//show what the CSS alert looks like
$("#demoCSSAlert").click(function () {
    $('body').prepend('<div id="note">&#9821; Bishop matched your rule "Git Repo". (Refresh page to dismiss)</div>');
});

//get live updates when something changes
chrome.storage.onChanged.addListener(function (changes, namespace) {
    populateRuleTable();
    populateSiteTable();
});