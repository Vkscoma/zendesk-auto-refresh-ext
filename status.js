const updateStatus = (status) => {
    const statusDiv = document.querySelector("#status");
    const statusText = document.querySelector("#status-text");
    const loader = document.querySelector(".loader");

    if (!statusDiv || !statusText) {
        console.error("Status elements not found!");
        return;
    }

    console.log("Fetched Status:", status); // Debugging

    if (status === "running") {
        statusDiv.style.backgroundColor = "#00B086"; // Green for running
        statusText.textContent = "Running";
        loader.style.display = "inline-block";
    } else if (status === "error") {
        statusDiv.style.backgroundColor = "#dc3545"; // Red for error
        statusText.textContent = "Stopped";
        loader.style.display = "none";
    } else {
        statusDiv.style.backgroundColor = "#6c757d"; // Gray for stopped
        statusText.textContent = "Idle";
    }
};

chrome.storage.local.get(["status"], (result) => {
    updateStatus(result.status || "stopped");
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.status) {
        updateStatus(changes.status.newValue);
    }
});
