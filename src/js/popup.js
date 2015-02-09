/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/

var syncRules;

function init_main() {
    //get the current enabled state and rule list
    chrome.storage.sync.get('status', function (data) {
        if (typeof data.status === "undefined") {
            //this is first use; enable by default and save
            chrome.storage.sync.set({
                "status": 1
            });
            var isEnabled = 1;
        }
        else {
            var isEnabled = parseInt(data.status);
        }

        //make the switch reflect our current state
        if (isEnabled) {
            $("#status").prop("checked", true);
        }
        else {
            $("#status").prop("checked", false);
        }
    });

    //build options link
    $("#optLink").attr("href", chrome.extension.getURL("html/options.html"));

    //show the menu
    $('html').hide().fadeIn('slow');
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);

//handle enabling or disabling or the extension
$('#status').change(function () {
    if ($("#status").prop("checked")) {
        chrome.storage.sync.set({
            "status": 1
        });
    }
    else {
        chrome.storage.sync.set({
            "status": 0
        });
    }
});