const fs = require('fs');
const path = require('path');

const pluginsDir = __dirname;

const getPlugins = () => {
    const plugins = fs.readdirSync(pluginsDir); 
    const commands = {};

    plugins.forEach((file) => {
        if (file.endsWith('.js') && file !== 'menu.js') { 
            const plugin = require(path.join(pluginsDir, file)); 
            if (plugin.command && plugin.type) { 
                plugin.type.forEach((type) => {
                    if (!commands[type]) commands[type] = []; 
                    commands[type].push({
                        command: plugin.command,
                        description: plugin.description || 'No description available'
                    });
                });
            }
        }
    });

    return commands;
};

const displayMenu = (client, commands) => {
    let menuText = `*RAFFBOT* is a WhatsApp bot the Baileys library\.\n\n`;
    
    menuText += `  ▢ ReCoder : RAFF66\n`;
    menuText += `  ▢ Library : WS-Baileys\n`;
    menuText += `  ▢ Mode : ${client.public ? 'public' : 'self'}\n`; 
    menuText += `  ▢ Type : Plugin\n\n`;

    for (const [type, cmdList] of Object.entries(commands)) {
        menuText += `— ${type}\n`;
        cmdList.forEach(cmd => {
            menuText += `𐓷 .${cmd.command} ${cmd.description}\n`;
        });
        menuText += '\n'; 
    }

    menuText += `I M R A F F B O T\n`;

    return menuText;
};

module.exports = {
    command: 'menu',
    type: ["main"],
    async execute(client, m, args, pushName) {
        const commands = getPlugins(); 
        const menuText = displayMenu(client, commands); 
        menu(menuText); 
    }
};
