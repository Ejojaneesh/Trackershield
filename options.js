document.addEventListener("DOMContentLoaded", async () => {

    // ==========================
    // Elements
    // ==========================

    const toggle = document.getElementById("toggleProtection");
    const statusText = document.getElementById("statusText");

    const blockedCount = document.getElementById("blockedCount");
    const todayBlocked = document.getElementById("todayBlocked");

    const whitelistInput = document.getElementById("whitelistInput");
    const blacklistInput = document.getElementById("blacklistInput");

    const whitelistList = document.getElementById("whitelist");
    const blacklistList = document.getElementById("blacklist");

    const addWhitelist = document.getElementById("addWhitelist");
    const addBlacklist = document.getElementById("addBlacklist");

    const exportSettings = document.getElementById("exportSettings");
    const exportStats = document.getElementById("exportStats");
    const resetStats = document.getElementById("resetStats");

    // ==========================
    // Defaults
    // ==========================

    const defaults = {

        protectionEnabled: true,

        whitelist: [],

        blacklist: [],

        statistics: {

            blockedCount: 0,
            todayCount: 0,
            siteCount: 0,
            blockedDomains: {},
            protectedSites: [],
            activityLog: [],
            lastReset: new Date().toISOString().split("T")[0]

        }

    };

    // ==========================
    // Load
    // ==========================

    let data = await chrome.storage.local.get(defaults);

    toggle.checked = data.protectionEnabled;

    blockedCount.textContent =
        data.statistics.blockedCount;

    todayBlocked.textContent =
        data.statistics.todayCount;

    updateStatus();

    renderWhitelist(data.whitelist);

    renderBlacklist(data.blacklist);

    // ==========================
    // Toggle
    // ==========================

    toggle.addEventListener("change", async () => {

        await chrome.storage.local.set({

            protectionEnabled:
                toggle.checked

        });

        updateStatus();

    });

    // ==========================
    // Add Whitelist
    // ==========================

    addWhitelist.addEventListener("click", async () => {

        const value =
            whitelistInput.value.trim().toLowerCase();

        if (!isValidDomain(value)) {

            alert("Enter a valid domain.");

            return;

        }

        if (data.whitelist.includes(value)) {

            alert("Already exists.");

            return;

        }

        data.whitelist.push(value);

        await chrome.storage.local.set({

            whitelist: data.whitelist

        });

        whitelistInput.value = "";

        renderWhitelist(data.whitelist);

    });

    // ==========================
    // Add Blacklist
    // ==========================

    addBlacklist.addEventListener("click", async () => {

        const value =
            blacklistInput.value.trim().toLowerCase();

        if (!isValidDomain(value)) {

            alert("Enter a valid domain.");

            return;

        }

        if (data.blacklist.includes(value)) {

            alert("Already exists.");

            return;

        }

        data.blacklist.push(value);

        await chrome.storage.local.set({

            blacklist: data.blacklist

        });

        blacklistInput.value = "";

        renderBlacklist(data.blacklist);

    });

    // ==========================
    // Export Full Backup
    // ==========================

    exportSettings.addEventListener("click", async () => {

        const backup = await chrome.storage.local.get(null);

        const blob = new Blob(
            [
                JSON.stringify(backup, null, 4)
            ],
            {
                type: "application/json"
            }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download =
            `TrackerShield_Backup_${new Date().toISOString().split("T")[0]}.json`;

        a.click();

        URL.revokeObjectURL(url);

        alert("Backup exported successfully.");

    });

    // ==========================
    // Export Statistics
    // ==========================

    exportStats.addEventListener("click", async () => {

        const storage = await chrome.storage.local.get("statistics");

        const blob = new Blob(
            [
                JSON.stringify(storage.statistics, null, 4)
            ],
            {
                type: "application/json"
            }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download =
            `TrackerShield_Statistics_${new Date().toISOString().split("T")[0]}.json`;

        a.click();

        URL.revokeObjectURL(url);

        alert("Statistics exported successfully.");

    });

    // ==========================
    // Reset Statistics
    // ==========================

    resetStats.addEventListener("click", async () => {

        if (!confirm("Reset all statistics?"))
            return;

        const statistics = {

            blockedCount: 0,
            todayCount: 0,
            siteCount: 0,
            blockedDomains: {},
            protectedSites: [],
            activityLog: [],
            lastReset: new Date().toISOString().split("T")[0]

        };

        await chrome.storage.local.set({

            statistics

        });

        blockedCount.textContent = 0;
        todayBlocked.textContent = 0;

        alert("Statistics reset successfully.");

    });

    // ==========================
    // Render Whitelist
    // ==========================

    function renderWhitelist(list) {

        whitelistList.innerHTML = "";

        list.forEach((domain, index) => {

            const li = document.createElement("li");

            li.innerHTML = `
                ${domain}
                <button data-index="${index}" class="removeWhite">
                    Remove
                </button>
            `;

            whitelistList.appendChild(li);

        });

        document.querySelectorAll(".removeWhite")
            .forEach(button => {

                button.onclick = async () => {

                    data.whitelist.splice(
                        button.dataset.index,
                        1
                    );

                    await chrome.storage.local.set({

                        whitelist: data.whitelist

                    });

                    renderWhitelist(data.whitelist);

                };

            });

    }

    // ==========================
    // Render Blacklist
    // ==========================

    function renderBlacklist(list) {

        blacklistList.innerHTML = "";

        list.forEach((domain, index) => {

            const li = document.createElement("li");

            li.innerHTML = `
                ${domain}
                <button data-index="${index}" class="removeBlack">
                    Remove
                </button>
            `;

            blacklistList.appendChild(li);

        });

        document.querySelectorAll(".removeBlack")
            .forEach(button => {

                button.onclick = async () => {

                    data.blacklist.splice(
                        button.dataset.index,
                        1
                    );

                    await chrome.storage.local.set({

                        blacklist: data.blacklist

                    });

                    renderBlacklist(data.blacklist);

                };

            });

    }

    // ==========================
    // Helpers
    // ==========================

    function updateStatus() {

        if (toggle.checked) {

            statusText.textContent =
                "Protection Enabled";

            statusText.style.color =
                "#16a34a";

        }

        else {

            statusText.textContent =
                "Protection Disabled";

            statusText.style.color =
                "#dc2626";

        }

    }

    function isValidDomain(domain) {

        return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);

    }

});