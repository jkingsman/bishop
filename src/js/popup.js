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
            var isEnabled = data.status;
        }

        //make the switch reflect our current state
        if (isEnabled) {
            $("#status").html('<span class="bg-success">Enabled</span>');
        }
        else {
            $("#status").html('<span class="bg-danger">Disabled</span>');
        }
    });

    //build options link
    $("#optLink").attr("href", chrome.extension.getURL("html/options.html"));

    //show the menu
    $('html').hide().fadeIn('slow');
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);