const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'getplug',
    type: ['owner'],
    description: '*name plug*',
    async execute(client, m, args, NReply, Access) {
        if (!Access) return NReply('only my owner can access this feature lol 🗣️.');
        const fileName = args[0];
        if (!fileName) return NReply('please enter the name of the file you want to retrieve (without the .js extension) *Example:* .getplug tiktok')
        const filePath = path.join(__dirname, `${fileName}.js`);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return NReply(`failed to retrieve file: ${fileName}.js`);
            NReply(`file contents ${fileName}.js:\n\n${data}`)
        });
    }
}