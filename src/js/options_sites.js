//clear sites table and populate
function populateSiteTable() {
    $('#siteTableBody').empty();
    chrome.storage.sync.get(null, function (data) {
        //populate the table
        for (var i = 0; i < data.sites.length; i++) {
            var site = data.sites[i];

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
        }, function() {
            populateSiteTable();
            showNotification("success", "Site list cleared.");
        });
    }
});

//pops up a modal with the JSON of the vulnerable sites in it
$("#exportSites").click(function () {
    chrome.storage.sync.get(null, function (data) {
        sites = data.sites;
        $("#exportBox").val(JSON.stringify(sites));
        $('#exportDataModal').modal('show');
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
        }, function(){
	    //redraw
	    populateSiteTable();
	    showNotification("warning", "Site deleted.");
	});
    });
});