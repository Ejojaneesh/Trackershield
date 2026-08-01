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

    if (!data.statistics)
        updates.statistics = { ...DEFAULT_STATISTICS };

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

    chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async (info) => {

        const data = await chrome.storage.local.get([
            "statistics",
            "protectionEnabled"
        ]);

        if (data.protectionEnabled === false)
            return;

        const stats = data.statistics || { ...DEFAULT_STATISTICS };

        stats.blockedCount++;
        stats.todayCount++;

        try {

            // Tracker Domain

            const trackerDomain =
                new URL(info.request.url).hostname;

            stats.blockedDomains[trackerDomain] =
                (stats.blockedDomains[trackerDomain] || 0) + 1;

            // Protected Website

            const pageUrl =
                info.request.initiator ||
                info.request.documentUrl;

            if (pageUrl) {

                const protectedSite =
                    new URL(pageUrl).hostname;

                if (!stats.protectedSites.includes(protectedSite)) {

                    stats.protectedSites.push(protectedSite);

                    stats.siteCount =
                        stats.protectedSites.length;

                }

            }

            // Activity Log

            stats.activityLog.unshift({

                tracker: trackerDomain,

                website: pageUrl || "Unknown",

                timestamp: new Date().toLocaleString(),

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