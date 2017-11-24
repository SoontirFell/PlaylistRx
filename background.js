var playlistrWindow;

function openMyPage() {
    'use strict';
    
    chrome.tabs.create({
        "url": chrome.extension.getURL("index.html")
    });
}

chrome.browserAction.onClicked.addListener(openMyPage);