function init_main() {
    //set up our options and site list
    buildPage();

    //show the menu
    $('html').hide().fadeIn('slow');
}

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
	$("#exclusionList").val(config.exclusionList);

        //be loud if it's disabled
        if (!enabled) {
            showNotification("danger", "Get Git is currently disabled.")
        }

        populateSiteTable();
        populateRuleTable();
    });
}

//show notifications
//type is a bootstrap alert class sans the 'alert-'
//message is the message to display
//time is the amount of time it should be visible in seconds; set 0 for indefinitely
function showNotification(type, message) {
    $.growl(message, {type: type});
}

/*
 * Begin Event Listeners
 */

$("[name^=config]").on('change keyup paste', function(){
    //build out an array of config options
    var config = {
        recursive: $("#recursive").prop("checked"),

        soundFound: $("#soundFound").prop("checked"),
        alertFound: $("#alertFound").prop("checked"),
        alertCSSFound: $("#alertCSSFound").prop("checked"),

	xhrDelay: $("#xhrDelay").val(),
	
	exclusionList: $("#exclusionList").val()

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
    var audio = new Audio('../audio/alert.mp3');
    audio.play();
});

//show what the alert looks like
$("#demoAlert").click(function () {
    alert("This site has a publically accessible Git repo.");
});

//show what the CSS alert looks like
$("#demoCSSAlert").click(function () {
    $('body').prepend('<div id="note">This website has a web accessible .git directory! (Refresh page to dismiss)</div>');
});

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);

//listen for storage changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
    populateRuleTable();
    populateSiteTable();
});