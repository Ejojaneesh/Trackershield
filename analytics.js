document.addEventListener("DOMContentLoaded", async () => {

    const totalBlocked = document.getElementById("totalBlocked");
    const todayBlocked = document.getElementById("todayBlocked");
    const protectedSites = document.getElementById("protectedSites");

    const domainList = document.getElementById("domainList");

    const resetBtn = document.getElementById("resetStats");
    const exportBtn = document.getElementById("exportStats");

    const data = await chrome.storage.local.get("statistics");

    const stats = data.statistics || {
        blockedCount: 0,
        todayCount: 0,
        siteCount: 0,
        blockedDomains: {}
    };

    totalBlocked.textContent = stats.blockedCount;
    todayBlocked.textContent = stats.todayCount;
    protectedSites.textContent = stats.siteCount;

    domainList.innerHTML = "";

    const domains = Object.entries(stats.blockedDomains);

    if (domains.length === 0) {

        const li = document.createElement("li");
        li.textContent = "No tracker data available.";
        domainList.appendChild(li);

    } else {

        domains
            .sort((a, b) => b[1] - a[1])
            .forEach(([domain, count]) => {

                const li = document.createElement("li");

                li.textContent = `${domain} — ${count}`;

                domainList.appendChild(li);

            });

    }

    resetBtn.addEventListener("click", async () => {

        if (!confirm("Reset all statistics?"))
            return;

        await chrome.storage.local.set({
            statistics: {
                blockedCount: 0,
                todayCount: 0,
                siteCount: 0,
                blockedDomains: {},
                lastReset: new Date().toDateString()
            }
        });

        location.reload();

    });

    exportBtn.addEventListener("click", async () => {

        const blob = new Blob(
            [
                JSON.stringify(stats, null, 4)
            ],
            {
                type: "application/json"
            }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "TrackerShield_Statistics.json";

        a.click();

        URL.revokeObjectURL(url);

    });

});