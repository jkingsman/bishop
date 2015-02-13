//clear sites table and populate


function populateSiteTable() {
    var site;
    $('#siteTableBody').empty();
    chrome.storage.sync.get(null, function (data) {
        //populate the table
        for (var i = parseInt(data.sites.length) - 1; i >= 0; i--) {
            site = data.sites[i];

            //append the URL to the table
            $('#siteTableBody').append('<tr><td><strong>' + site.url + '</strong></td><td>' + site.rule + '</td><td class="text-center"><a href="#" id="delSite' + site.uid + '"><i class="glyphicon glyphicon-trash"></i></a></td>');
        }

        //let the user know if we don't have any sites stored
        if (data.sites.length < 1) {
            $('#siteTableBody').append('<tr><td colspan=3>No sites collected yet!</td></tr>');
        }
    });
}

//erase sites from the table and from storage
$("#clearSites").click(function () {
    var confirmed = confirm("This will delete all stored sites.");
    if (confirmed) {
        chrome.storage.sync.set({
            "sites": []
        }, function () {
            showNotification("success", "Site list cleared.");
        });
    }
});

//pops up a modal with the JSON of the vulnerable sites in it
$("#exportSites").click(function () {
    chrome.storage.sync.get(null, function (data) {
        var sites = data.sites;
        $("#exportBox").val(JSON.stringify(sites));
        $('#exportDataModal').modal('show');
    });
});

//pops up a modal with the JSON of the vulnerable sites in it
$("#importSites").click(function () {
    var importData, site;
    var confirmed = confirm("This will delete all import the current contents of the textarea; badly formed data will cause problems. Please reference the export format for the correct import format.");
    if (confirmed) {
        importData = jQuery.parseJSON($("#exportBox").val());
        chrome.storage.sync.get(null, function (data) {
          for (var i = 0; i < importData.length; i++) {
              site = importData[i];
              data.sites.push(site);
          }
          chrome.storage.sync.set({
            'sites': data.sites
          }, function () {
              showNotification("success", "Sites loaded. You may need to deduplicate.");
              $('#exportDataModal').modal('hide');
          });
        });
    }
});

//deduplicates site list
$("#dedupSites").click(function () {
    chrome.storage.sync.get(null, function (data) {
        var sites = data.sites;
        var nonDups = [],
            isDup = 0,
            site, checkSite;

        //loop through all our sites; add the unique ones to a nonDups list
        for (var i = 0; i < sites.length; i++) {
            isDup = 0;
            site = data.sites[i];

            //loop through all our no duplicates; set the flag if we find it in there (it's a duplicate)
            for (var j = 0; j < nonDups.length; j++) {
                checkSite = nonDups[j];
                if (site.url == checkSite.url && site.rule == checkSite.rule) {
                    isDup = 1;
                }
            }

            //it's not in the nonduplicate list; add it
            if (!isDup) {
                nonDups.push(site);
            }
        }

        //send it to the great gig in the sky
        chrome.storage.sync.set({
            'sites': nonDups
        }, function () {
            showNotification("success", "List deduplicated. You may need to refresh to see the changes.");
        });
    });
});

//hook the delete site link (have to do this a bit funky since they're dynamically added)
$(document.body).on("click", "[id^=delSite]", function () {
    //extract the UID from the element ID
    var id = this.id.replace(/delSite/g, '')

    chrome.storage.sync.get(null, function (data) {
        sites = data.sites;

        //loop through the ID's and find our ID
        for (var i = 0; i < sites.length; i++) {
            var site = sites[i];
            if (site.uid == id) {
                sites.splice(i, 1);
            }
        }

        chrome.storage.sync.set({
            "sites": sites
        }, function () {
            showNotification("warning", "Site deleted.");
        });
    });
});