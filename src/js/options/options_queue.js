function populateQueueTable() {
    var totalCount = 0;

    $('#queueTableBody').empty();
    chrome.storage.sync.get(null, function (data) {
        //populate the table
        for (var i = 0; i < data.queue.length; i++) {
            site = data.queue[i];
            totalCount++;

            //append the URL to the table
            $('#queueTableBody').append('<tr><td>' + site.url + '</td></tr>');
        }

        //set our counts
        $('#queueCount').html(totalCount + " sites in the queue");

        //let the user know if we don't have any sites stored
        if (data.queue.length < 1) {
            $('#queueTableBody').append('<tr><td>Queue is empty!</td></tr>');
        }
    });
}

//erase sites from the table and from storage
$("#clearQueue").click(function () {
    var confirmed = confirm("This will delete all sites in the queue.");
    if (confirmed) {
        chrome.storage.sync.set({
            "queue": []
        }, function () {
            showNotification("success", "Queue cleared.");
        });
    }
});

//chomp through the queue
$("#processQueue").click(function () {
    var currentItem;
    var confirmed = confirm("Process the entire queue? This will take a while and run in the background; please don't close the tab.");
    if (confirmed) {
        chrome.storage.sync.get(null, function (data) {
            var queue = data.queue;
            while (queue.length != 0) {
                //pop it from the queue
                currentItem = queue.pop();

                //run the scan
                doScan(stripTrailingSlash(currentItem.url), data.config.recursive);

                //save the queue
                chrome.storage.sync.set({
                    "queue": queue
                })
            }
        });
    }
});