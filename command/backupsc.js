const { execSync } = require("child_process");
const fs = require("fs");

module.exports = {
    command: 'backup',
    type: ['owner'],
    description: '*owner*',
    async execute(client, m, args, NReply, Access) {
        if (!Access) return NReply('only my owner can access this feature lol 🗣️.');
        const ls = execSync("ls").toString().split("\n").filter(
            (pe) =>
                pe != "node_modules" &&
                pe != "package-lock.json" &&
                pe != "yarn.lock" &&
                pe != "tmp" &&
                pe != ""
        );
        
        execSync(`zip -r backup.zip ${ls.join(" ")}`);
        await client.sendMessage(m.chat, {
            document: fs.readFileSync("./backup.zip"),
            mimetype: "application/zip",
            fileName: "backup.zip"
        }, { quoted: m });
        execSync("rm -rf backup.zip");
    }
};