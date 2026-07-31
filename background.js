chrome.runtime.onInstalled.addListener(async () => {

    console.log("TrackerShield installed successfully.");

    await chrome.storage.local.set({
        protectionEnabled: true,
        whitelist: [],
        blacklist: []
    });

    await chrome.storage.local.set({
        statistics: {
            blockedCount: 0,
            todayCount: 0,
            siteCount: 0,
            blockedDomains: {},
            lastReset: new Date().toDateString()
        }
    });

    chrome.action.setBadgeText({
        text: "0"
    });

    chrome.action.setBadgeBackgroundColor({
        color: "#2563EB"
    });

});


chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener(async (info) => {

    const data = await chrome.storage.local.get([
        "statistics",
        "protectionEnabled"
    ]);

    if (data.protectionEnabled === false) return;

    let stats = data.statistics;

    if (!stats) {
        stats = {
            blockedCount: 0,
            todayCount: 0,
            siteCount: 0,
            blockedDomains: {},
            lastReset: new Date().toDateString()
        };
    }

    stats.blockedCount++;
    stats.todayCount++;

    const domain = new URL(info.request.url).hostname;

    if (!stats.blockedDomains[domain]) {
        stats.blockedDomains[domain] = 0;
    }

    stats.blockedDomains[domain]++;

    await chrome.storage.local.set({
        statistics: stats
    });

    chrome.action.setBadgeText({
        text: String(stats.blockedCount)
    });

});