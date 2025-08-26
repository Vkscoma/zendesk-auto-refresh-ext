chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ refreshInterval: 30 });
});

const setRunningStatus = (status) => {
    chrome.storage.local.set({ status: status }).catch((error) => {
        console.error("Failed to set running status:", error);
    });
}


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.status === "complete") {
        if (tab.url && tab.url.includes("zendesk")) {
            chrome.storage.local.get(["status"], (result) => {
                if (result.status === "running") {
                    setRunningStatus(true);
                } else {
                    setRunningStatus(false);
                }
            });
        }
    }
});


chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    chrome.tabs.get(tabId, (tab) => {
        if (tab.url && tab.url.includes("zendesk")) {
            setRunningStatus(false);
        }
    });
});



chrome.runtime.onSuspend.addListener(() => {
    setRunningStatus(false);
});


chrome.runtime.onStartup.addListener(() => {
    setRunningStatus(true);
});

const sendReloadMessage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
                location.reload();
            }
        }).catch((error) => {
            console.error("Failed to inject script:", error);
        });
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "reloadPage") {
        sendReloadMessage();
        sendResponse({ status: "Reload triggered" });
    }
});

chrome.alarms.create("keepAwake", { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "keepAwake") {
        console.log("Service worker woken up");
    }
});
