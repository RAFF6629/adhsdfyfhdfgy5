const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'listplug',
    type: ['owner'],
    description: '*owner*',
    async execute(client, m, args, NReply, Access) {
        if (!Access) return NReply('only my owner can access this feature lol 🗣️.');
        const dirPath = path.join(__dirname);
        fs.readdir(dirPath, (err, files) => {
            if (err) return NReply('failed to read directory.')
            const sortedFiles = files.sort((a, b) => a.localeCompare(b));
            if (sortedFiles.length === 0) return NReply('no files found in command folder.')
            const response = `files available in the command folder:\n${sortedFiles.map(file => `- ${file}`).join('\n')}`;
            client.sendMessage(m.chat, { text: response }, { quoted: m });
        });
    }
}
