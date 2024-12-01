const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const { ytdl } = require('./lib/scrape/scrape-ytdl');
const { getGroupAdmins } = require('./lib/myfunction')
const { getContentType }  = require('@whiskeysockets/baileys');
const loadCommands = () => {
    return fs.readdirSync(path.join(__dirname, '../command'))
        .filter(file => file.endsWith('.js'))
        .map(file => require(path.join(__dirname, '../command', file)));
};

let commands = loadCommands();

module.exports = async (client, m, chatUpdate, store) => {
    const { mtype } = m;
    const isGroup = m.chat.endsWith('@g.us');
    const chat = isGroup ? [m.chat] : false;
    const type = getContentType(m.message);
    const remoteJid = m.key.remoteJid;
    const content = JSON.stringify(m.message);
    
    if (global.db.data == null) await loadDatabase()
    require('./lib/schema')(m);
    var chats = global.db.data.chats[m.chat],
    users = global.db.data.users[m.sender]
    settings = global.db.data.settings
    try {
        const body = (
            m.mtype === "conversation" ? m.message.conversation :
            m.mtype === "imageMessage" ? m.message.imageMessage.caption :
            m.mtype === "videoMessage" ? m.message.videoMessage.caption :
            m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
            m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
            m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
            m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
            m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
            ""
        );

        const kontributor = JSON.parse(fs.readFileSync('./start/lib/database/owner.json'));

        const sender = m.key.fromMe ? client.user.id.split(":")[0] + "@s.whatsapp.net" || client.user.id : m.key.participant || m.key.remoteJid;
        const botNumber = await client.decodeJid(client.user.id);
        const Access = [botNumber, ...kontributor, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const senderNumber = sender.split('@')[0];
        const budy = (typeof m.text === 'string' ? m.text : '');
        const prefix = ".";
        const from = m.key.remoteJid;
        const isGroup = from.endsWith("@g.us");

        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);
        const pushName = m.pushName || "No Name";

        const groupMetadata = m.isGroup ? await client.groupMetadata(from).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false

        console.log('====================');
        console.log(chalk.black(chalk.bgWhite(!command ? '|| CHAT ||' : '|| CMD ||')), chalk.black(chalk.bgGreen(new Date().toLocaleString())) + ' >', chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' + chalk.magenta('=> From'), chalk.green(pushName), chalk.yellow(m.sender) + '\n' + chalk.blueBright('=> In'), chalk.green(isGroup ? groupName : 'Private Chat', m.chat));

        async function NReply(teks) {
            client.sendMessage(m.chat, { 
                text: teks,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        showAdAttribution: true,
                        isForwarded: true,
                        containsAutoReply: true,
                        title: `RAFFBOT`,
                        body: ``,
                        previewType: "VIDEO",
                        thumbnailUrl: `https://i.imgur.com/alMMKqG.png`,
                        thumbnail: ``,
                        sourceUrl: `https://www.youtube.com/@RAFF66`
                    }
                }
            }, { quoted: m });
        };

        global.menu = (teks) => {
            client.sendMessage(m.chat, { 
                text: teks,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardedNewsletterMessageInfo: {
                       newsletterName: "RAFFBOT",
                        newsletterJid: `120363295825562726@newsletter`,
                      },
                    isForwarded: true,
                    externalAdReply: {
                        showAdAttribution: false,
                        renderLargerThumbnail: true,
                        title: `RAFFBOT`,
                        body: `A simple WhatsApp bot uses JavaScript to respond to commands automatically.`,
                        mediaType: 1,
                        thumbnailUrl: `https://i.imgur.com/alMMKqG.png`,
                        thumbnail: ``,
                        sourceUrl: `https://www.youtube.com/@RAFF66`
                    }
                }
            }, { quoted: m });
        };

        if (budy.startsWith('~') || budy.startsWith('~>') || budy.startsWith('$')) {
            try {
                let evaled;
                if (budy.startsWith('~')) {
                    if (!Access) return;
                    evaled = await eval(budy.slice(2));
                } else if (budy.startsWith('~>')) {
                    if (!Access) return;
                    evaled = await eval(`(async () => { ${budy.slice(2)} })()`);
                } else if (budy.startsWith('$')) {
                    if (!Access) return;
                    const { exec } = require('child_process');
                    exec(budy.slice(2), (err, stdout) => {
                        if (err) return client.sendMessage(m.chat, { text: `${err}` }, { quoted: m });
                        if (stdout) return client.sendMessage(m.chat, { text: stdout }, { quoted: m });
                    });
                    return;
                }
                if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                await client.sendMessage(m.chat, { text: evaled }, { quoted: m });
            } catch (err) {
                await client.sendMessage(m.chat, { text: String(err) }, { quoted: m });
            }
        }

        const cmd = commands.find(cmd => cmd.command === command);
        if (cmd) {
            await cmd.execute(client, m, args, NReply, Access, isBotAdmins, isAdmins);
        }
    } catch (err) {
        console.error(chalk.red('Error occurred:'), err);
    }
};

// Memantau folder command untuk reload otomatis
const commandPath = path.join(__dirname, '../command');
fs.readdirSync(commandPath).forEach(file => {
    const fullPath = path.join(commandPath, file);
    fs.watchFile(fullPath, () => {
        delete require.cache[require.resolve(fullPath)];
        commands = loadCommands();
        console.log(chalk.green(`File command '${file}' telah di-update dan reload otomatis berhasil!`));
    });
});