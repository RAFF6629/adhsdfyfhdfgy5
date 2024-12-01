const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'delplug',
    type: ['owner'],
    description: '*name plug*',
    async execute(client, m, args, NReply, Access) {
        if (!Access) return NReply('only my owner can access this feature lol 🗣️.');
        const fileName = args[0];
        if (!fileName) return NReply('please enter the name of the file you want to delete without the .js extension *Example:* .delplug tiktok');
        const filePath = path.join(__dirname, `${fileName}.js`);
        fs.unlink(filePath, (err) => {
            if (err) return NReply(`failed to delete file: ${fileName}.js`)
            NReply(`${fileName}.js file was successfully deleted.`)
        });
    }
}