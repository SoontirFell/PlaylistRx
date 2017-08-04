var playlistrWindow;

function openMyPage() {
    'use strict';
    
    chrome.tabs.create({
        "url": chrome.extension.getURL("playlistRx.html")
    });
}

chrome.browserAction.onClicked.addListener(openMyPage);