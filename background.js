// ===========================================
// TrackerShield Background Service
// Version: 1.2.0
// ===========================================

// ---------- Constants ----------

const DEFAULT_STATISTICS = {
    blockedCount: 0,
    todayCount: 0,
    siteCount: 0,
    blockedDomains: {},
    protectedSites: [],
    activityLog: [],
    lastReset: new Date().toISOString().split("T")[0]
};

// ---------- Active Website ----------

let currentWebsite = "";

// ---------- Utility Functions ----------

function getToday() {
    return new Date().toISOString().split("T")[0];
}

async function updateBadge(count, enabled) {

    if (!enabled) {

        await chrome.action.setBadgeText({
            text: "OFF"
        });

        await chrome.action.setBadgeBackgroundColor({
            color: "#6B7280"
        });

        return;

    }

    await chrome.action.setBadgeText({
        text: count > 0 ? String(count) : ""
    });

    await chrome.action.setBadgeBackgroundColor({
        color: "#2563EB"
    });

}

async function initializeStorage() {

    const data = await chrome.storage.local.get([
        "protectionEnabled",
        "whitelist",
        "blacklist",
        "statistics"
    ]);

    const updates = {};

    if (data.protectionEnabled === undefined)
        updates.protectionEnabled = true;

    if (!Array.isArray(data.whitelist))
        updates.whitelist = [];

    if (!Array.isArray(data.blacklist))
        updates.blacklist = [];

    if (!data.statistics) {

        updates.statistics = structuredClone(DEFAULT_STATISTICS);

    }

    else {

        const stats = data.statistics;

        stats.blockedCount ??= 0;
        stats.todayCount ??= 0;
        stats.siteCount ??= 0;

        stats.blockedDomains ??= {};

        if (!Array.isArray(stats.protectedSites))
            stats.protectedSites = [];

        if (!Array.isArray(stats.activityLog))
            stats.activityLog = [];

        stats.lastReset ??= getToday();

        updates.statistics = stats;

    }

    if (Object.keys(updates).length > 0) {

        await chrome.storage.local.set(updates);

    }

}

// ---------- Daily Reset ----------

async function performDailyReset() {

    const data = await chrome.storage.local.get("statistics");

    if (!data.statistics)
        return;

    const stats = data.statistics;

    if (stats.lastReset !== getToday()) {

        stats.todayCount = 0;

        stats.lastReset = getToday();

        await chrome.storage.local.set({

            statistics: stats

        });

    }

}

// ---------- Active Tab Tracking ----------

async function updateCurrentWebsite(tab) {

    try {

        if (!tab?.url)
            return;

        if (

            tab.url.startsWith("chrome://") ||

            tab.url.startsWith("edge://") ||

            tab.url.startsWith("about:")

        )
            return;

        currentWebsite =
            new URL(tab.url).hostname;

    }

    catch (error) {

        console.warn(error);

    }

}

chrome.tabs.onActivated.addListener(async () => {

    const tabs = await chrome.tabs.query({

        active: true,

        currentWindow: true

    });

    if (tabs.length)

        await updateCurrentWebsite(tabs[0]);

});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

    if (

        tab.active &&

        changeInfo.status === "complete"

    ) {

        await updateCurrentWebsite(tab);

    }

});

// ---------- Installation ----------

chrome.runtime.onInstalled.addListener(async () => {

    console.log("TrackerShield installed successfully.");

    await initializeStorage();

    const data = await chrome.storage.local.get([

        "statistics",

        "protectionEnabled"

    ]);

    await updateBadge(

        data.statistics?.blockedCount || 0,

        data.protectionEnabled !== false

    );

});

// ---------- Startup ----------

chrome.runtime.onStartup.addListener(async () => {

    await initializeStorage();

    await performDailyReset();

    const data = await chrome.storage.local.get([

        "statistics",

        "protectionEnabled"

    ]);

    await updateBadge(

        data.statistics?.blockedCount || 0,

        data.protectionEnabled !== false

    );

});

// ---------- Tracker Detection ----------

if (chrome.declarativeNetRequest.onRuleMatchedDebug) {

    chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async (info) => {        const data = await chrome.storage.local.get([
            "statistics",
            "protectionEnabled"
        ]);

        if (data.protectionEnabled === false)
            return;

        const stats = data.statistics || structuredClone(DEFAULT_STATISTICS);

        // Ensure all required fields exist

        stats.blockedCount ??= 0;
        stats.todayCount ??= 0;
        stats.siteCount ??= 0;

        if (!stats.blockedDomains)
            stats.blockedDomains = {};

        if (!Array.isArray(stats.protectedSites))
            stats.protectedSites = [];

        if (!Array.isArray(stats.activityLog))
            stats.activityLog = [];

        try {

            // ==========================
            // Tracker Domain
            // ==========================

            const trackerDomain =
                new URL(info.request.url).hostname;

            stats.blockedDomains[trackerDomain] =
                (stats.blockedDomains[trackerDomain] || 0) + 1;

            // ==========================
            // Statistics
            // ==========================

            stats.blockedCount++;

            stats.todayCount++;

            // ==========================
            // Protected Website
            // ==========================

            if (currentWebsite) {

                if (!stats.protectedSites.includes(currentWebsite)) {

                    stats.protectedSites.push(currentWebsite);

                    stats.siteCount =
                        stats.protectedSites.length;

                }

            }

            // ==========================
            // Activity Log
            // ==========================

            stats.activityLog.unshift({

                tracker: trackerDomain,

                website: currentWebsite || "Unknown",

                timestamp:
                    new Date().toLocaleString(),

                action: "Blocked"

            });

            if (stats.activityLog.length > 100) {

                stats.activityLog.pop();

            }

        }

        catch (error) {

            console.warn(

                "TrackerShield:",

                error.message

            );

        }

        await chrome.storage.local.set({

            statistics: stats

        });

        await updateBadge(

            stats.blockedCount,

            true

        );

    });

}