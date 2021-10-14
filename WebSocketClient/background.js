chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.getAllInWindow(undefined, function(tabs) {
        chrome.tabs.create({url: 'chrome-extension://' + location.host + '/index.html'})
    })
})
