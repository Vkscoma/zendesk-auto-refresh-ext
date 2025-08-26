document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("save");
    const intervalInput = document.getElementById("interval");

    chrome.storage.sync.get(["refreshInterval"], (result) => {
        if (result.refreshInterval) {
            intervalInput.value = result.refreshInterval;
        }

    });

    saveButton.addEventListener("click", () => {
        const intervalValue = Number(intervalInput.value);
        chrome.storage.sync.set({ refreshInterval: intervalValue });

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { message: "refresh" });
        });
    });
});
