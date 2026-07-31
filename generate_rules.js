const fs = require("fs");

const inputFile = "trackers.txt";
const outputFile = "rules.json";

const trackers = fs
    .readFileSync(inputFile, "utf8")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"));

const uniqueTrackers = [...new Set(trackers)];

const rules = uniqueTrackers.map((domain, index) => ({
    id: index + 1,
    priority: 1,
    action: {
        type: "block"
    },
    condition: {
        urlFilter: `||${domain}^`,
        resourceTypes: [
            "script",
            "xmlhttprequest",
            "image",
            "sub_frame"
        ]
    }
}));

fs.writeFileSync(
    outputFile,
    JSON.stringify(rules, null, 4)
);

console.log(`✅ Generated ${rules.length} rules.`);