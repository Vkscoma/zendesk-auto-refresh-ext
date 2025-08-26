console.log("Zendesk Auto Refresh Extension Working");
const saveInterval = async () => {
    const intervalInput = document.getElementById("interval");
    console.log('TEST:', intervalInput);

    chrome.storage.sync.get(["refreshInterval"], (result) => {
        if (result.refreshInterval) {
            intervalInput.value = result.refreshInterval;
        }
    });
    return intervalInput;
};

const updateStatus = (status) => {
    chrome.storage.local.set({ status }).catch((error) => {
        console.error("Failed to set running status:", error);
    });
    chrome.runtime.sendMessage({ status });
};

const refreshZendesk = () => {
    chrome.storage.sync.get(["refreshInterval"], (result) => {
        const interval = result.refreshInterval || 20;
        const convertInterval = interval * 1000;
        const refreshBtn = document.querySelector('[aria-label="Refresh views pane"]');

        if (refreshBtn) {
            refreshBtn.click();
            console.log(`Zendesk Auto-Refresh: Refreshed at ${new Date().toLocaleTimeString()}`);
            updateStatus("running");
            setTimeout(refreshZendesk, convertInterval);
        } else {
            console.error("Issue with Zendesk Auto-Refresh Extension");
            updateStatus("error");
            // setTimeout(refreshZendesk, 20000);
        }
    });
};


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "refresh") {
        refreshZendesk();
        sendResponse({ status: "running" });
    } else if (request.request === "stopped") {
        chrome.storage.local.get(["status"], (result) => {
            sendResponse({ status: result.status || "stopped" });
        });
        return true;
    } else if (request.action === "showMessage") {
        alert(request.message);
    }
});

window.addEventListener("beforeunload", () => {
    updateStatus("stopped");
});