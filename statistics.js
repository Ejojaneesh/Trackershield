/*
==================================================
TrackerShield Statistics Manager
Version: 2.0
==================================================
*/

class StatisticsManager {

    constructor() {

        this.defaultStatistics = {

            blockedCount: 0,
            todayCount: 0,
            siteCount: 0,

            blockedDomains: {},

            protectedSites: [],

            lastReset: this.getCurrentDate()

        };

    }

    getCurrentDate() {

        return new Date().toISOString().split("T")[0];

    }

    async initialize() {

        const data = await chrome.storage.local.get("statistics");

        if (!data.statistics) {

            await chrome.storage.local.set({
                statistics: this.defaultStatistics
            });

            return;

        }

        await this.checkDailyReset();

    }

    async checkDailyReset() {

        const data = await chrome.storage.local.get("statistics");

        const stats = data.statistics;

        if (!stats)
            return;

        const today = this.getCurrentDate();

        if (stats.lastReset !== today) {

            stats.todayCount = 0;
            stats.lastReset = today;

            await chrome.storage.local.set({
                statistics: stats
            });

        }

    }

    async getStatistics() {

        const data = await chrome.storage.local.get("statistics");

        return data.statistics || this.defaultStatistics;

    }

    async saveStatistics(stats) {

        await chrome.storage.local.set({
            statistics: stats
        });

    }

    async incrementBlocked(domain) {

        const stats = await this.getStatistics();

        stats.blockedCount++;
        stats.todayCount++;

        if (!stats.blockedDomains[domain]) {

            stats.blockedDomains[domain] = 0;

        }

        stats.blockedDomains[domain]++;

        await this.saveStatistics(stats);

        return stats;

    }

    async addProtectedSite(domain) {

        const stats = await this.getStatistics();

        if (!stats.protectedSites.includes(domain)) {

            stats.protectedSites.push(domain);

            stats.siteCount = stats.protectedSites.length;

            await this.saveStatistics(stats);

        }

    }

    async resetStatistics() {

        await chrome.storage.local.set({
            statistics: this.defaultStatistics
        });

    }

    async exportStatistics() {

        return await this.getStatistics();

    }

}

const statistics = new StatisticsManager();

statistics.initialize();