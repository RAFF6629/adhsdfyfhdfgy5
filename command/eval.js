const fs = require('fs');
const util = require('util');

module.exports = async (client, m, budy, Access) => {
    if (budy.startsWith('~')) {
        if (!Access) return;
        try {
            let evaled = await eval(budy.slice(2));
            if (typeof evaled !== 'string') evaled = util.inspect(evaled);
            await client.sendMessage(m.chat, { text: evaled }, { quoted: m });
        } catch (err) {
            await client.sendMessage(m.chat, { text: String(err) }, { quoted: m });
        }
    }

    if (budy.startsWith('~>')) {
        if (!Access) return;
        let kode = budy.trim().split(/ +/)[0];
        let teks;
        try {
            teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${budy.slice(2)} })()`);
        } catch (e) {
            teks = e;
        } finally {
            await client.sendMessage(m.chat, { text: util.format(teks) }, { quoted: m });
        }
    }

    if (budy.startsWith('$')) {
        if (!Access) return;
        exec(budy.slice(2), (err, stdout) => {
            if (err) return client.sendMessage(m.chat, { text: `${err}` }, { quoted: m });
            if (stdout) return client.sendMessage(m.chat, { text: stdout }, { quoted: m });
        });
    }
};
