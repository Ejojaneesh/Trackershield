document.addEventListener("DOMContentLoaded", async () => {

    const toggle = document.getElementById("toggleProtection");
    const blockedCount = document.getElementById("blockedCount");
    const todayCount = document.getElementById("todayCount");
    const siteCount = document.getElementById("siteCount");
    const analyticsBtn = document.getElementById("analyticsBtn");

    const data = await chrome.storage.local.get([
        "protectionEnabled",
        "statistics"
    ]);

    const stats = data.statistics || {
        blockedCount: 0,
        todayCount: 0,
        siteCount: 0
    };

    toggle.checked = data.protectionEnabled !== false;

    blockedCount.textContent = stats.blockedCount;
    todayCount.textContent = stats.todayCount;
    siteCount.textContent = stats.siteCount;

    toggle.addEventListener("change", async () => {

        await chrome.storage.local.set({
            protectionEnabled: toggle.checked
        });

    });

    analyticsBtn.addEventListener("click", () => {

        chrome.tabs.create({
            url: chrome.runtime.getURL("analytics.html")
        });

    });

});