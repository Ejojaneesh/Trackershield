document.addEventListener("DOMContentLoaded", async () => {

    // ==========================
    // Elements
    // ==========================

    const toggle = document.getElementById("toggleProtection");

    const blockedCount = document.getElementById("blockedCount");
    const todayCount = document.getElementById("todayCount");
    const siteCount = document.getElementById("siteCount");

    const analyticsBtn = document.getElementById("analyticsBtn");
    const settingsBtn = document.getElementById("settingsBtn");

    // ==========================
    // Refresh Popup
    // ==========================

    async function refreshPopup() {

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

        blockedCount.textContent = stats.blockedCount || 0;
        todayCount.textContent = stats.todayCount || 0;
        siteCount.textContent = stats.siteCount || 0;

    }

    // Initial Load
    await refreshPopup();

    // ==========================
    // Protection Toggle
    // ==========================

    toggle.addEventListener("change", async () => {

        await chrome.storage.local.set({

            protectionEnabled: toggle.checked

        });

    });

    // ==========================
    // Analytics Page
    // ==========================

    analyticsBtn.addEventListener("click", () => {

        chrome.tabs.create({

            url: chrome.runtime.getURL("analytics.html")

        });

    });

    // ==========================
    // Settings Page
    // ==========================

    settingsBtn.addEventListener("click", () => {

        chrome.runtime.openOptionsPage();

    });

    // ==========================
    // Auto Refresh Popup
    // ==========================

    chrome.storage.onChanged.addListener(async (changes, area) => {

        if (area === "local") {

            await refreshPopup();

        }

    });

});