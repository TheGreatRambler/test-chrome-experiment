//Needed for first installation
chrome.runtime.onInstalled.addListener(function(dataobject) {
    if (dataobject.reason === 'install') {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    }
});
// end

var
continue = true;
chrome.storage.sync.get(["timebetweenupdates", "chosensubreddit", "numofpoststoreturn"], function(items) {
    var timebetweenupdates = items[0]; // in seconds
    var chosensubreddit = items[1];
    var numofpoststoreturn = items[2];

    function returnredditurl(subreddit, n) {
        return "reddit.com/r/" + subreddit + "/new.json?sort=new&limit=" + n;
    }

    function checkforredditposts() {
        if (
            continue && chosensubreddit) {
            $.ajax({
                crossDomain: true,
                dataType: "text",
                url: returnredditurl(chosensubreddit, numofpoststoreturn)
            }).done(function(data) {
                chrome.tabs.getSelected(null, function(tab) {
                    chrome.tabs.executeScript(tab.id, {
                        file: "displaypost.js?data=" + data
                    }, function(response) {});
                });
                window.setTimeout(checkforredditposts, timebetweenupdates * 1000);
            });
        }
    }
});
