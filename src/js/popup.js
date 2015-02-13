/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/

var syncRules;

function init_main() {
    //get the current enabled state and rule list
    chrome.storage.sync.get(null, function (data) {
        //make the switch reflect our current state
        if (data.status) {
            $("#status").html('<span class="bg-success">Enabled</span>');
        } else if(data.config.enableQueue) {
            $("#status").html('<span class="bg-warning">Queueing</span>');
        } else{
            $("#status").html('<span class="bg-danger">Disabled</span>');
        }
        
        //build options link
        $("#optLink").attr("href", chrome.extension.getURL("html/options.html"));
    
        //show the menu
        $('html').hide().fadeIn('slow');
    });
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);