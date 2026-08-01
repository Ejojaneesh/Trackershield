document.addEventListener("DOMContentLoaded", async () => {

    // ==========================
    // Elements
    // ==========================

    const totalBlocked = document.getElementById("totalBlocked");
    const todayBlocked = document.getElementById("todayBlocked");
    const uniqueDomains = document.getElementById("uniqueDomains");

    const domainList = document.getElementById("domainList");
    const activityList = document.getElementById("activityList");
    const lastReset = document.getElementById("lastReset");

    const resetBtn = document.getElementById("resetStats");
    const exportBtn = document.getElementById("exportStats");

    // ==========================
    // Load Statistics
    // ==========================

    const data = await chrome.storage.local.get("statistics");

    const stats = data.statistics || {

        blockedCount: 0,
        todayCount: 0,
        blockedDomains: {},
        activityLog: [],
        lastReset: new Date().toISOString().split("T")[0]

    };

    // ==========================
    // Summary Cards
    // ==========================

    totalBlocked.textContent = stats.blockedCount || 0;

    todayBlocked.textContent = stats.todayCount || 0;

    uniqueDomains.textContent =
        Object.keys(stats.blockedDomains || {}).length;

    lastReset.textContent =
        stats.lastReset || "-";

    // ==========================
    // Top Blocked Domains
    // ==========================

    domainList.innerHTML = "";

    const domains =
        Object.entries(stats.blockedDomains || {});

    if (domains.length === 0) {

        const li = document.createElement("li");

        li.textContent =
            "No tracker data available yet.";

        domainList.appendChild(li);

    } else {

        domains
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .forEach(([domain, count]) => {

                const li = document.createElement("li");

                li.textContent =
                    `${domain} — ${count} blocked`;

                domainList.appendChild(li);

            });

    }

    // ==========================
    // Recent Activity
    // ==========================

    activityList.innerHTML = "";

    if (
        !stats.activityLog ||
        stats.activityLog.length === 0
    ) {

        const li = document.createElement("li");

        li.textContent =
            "No activity recorded yet.";

        activityList.appendChild(li);

    } else {

        stats.activityLog
            .slice(0, 10)
            .forEach(item => {

                const li = document.createElement("li");

                li.textContent =
                    `${item.timestamp} • ${item.action} ${item.tracker}`;

                activityList.appendChild(li);

            });

    }

    // ==========================
    // Reset Statistics
    // ==========================

    resetBtn.addEventListener("click", async () => {

        if (!confirm("Reset all statistics?"))
            return;

        await chrome.storage.local.set({

            statistics: {

                blockedCount: 0,
                todayCount: 0,
                blockedDomains: {},
                activityLog: [],
                lastReset:
                    new Date().toISOString().split("T")[0]

            }

        });

        location.reload();

    });

    // ==========================
    // Export Statistics
    // ==========================

    exportBtn.addEventListener("click", async () => {

        const blob = new Blob(

            [
                JSON.stringify(stats, null, 4)
            ],

            {
                type: "application/json"
            }

        );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download =
            `TrackerShield_Statistics_${new Date().toISOString().split("T")[0]}.json`;

        a.click();

        URL.revokeObjectURL(url);

    });

});