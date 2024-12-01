const fetch = require("node-fetch");

module.exports = {
    command: 'get',
    type: ['tools'],
    description: '*provide URL*',
    async execute(client, m, args, NReply) {
        const text = args.join(" ");
        if (!/^https?:\/\//.test(text)) {
            return NReply("Awali *URL* dengan http:// atau https://");
        }

        const ajg = await fetch(text);
        if (ajg.headers.get("content-length") > 100 * 1024 * 1024) {
            throw `Content-Length: ${ajg.headers.get("content-length")}`;
        }

        const contentType = ajg.headers.get("content-type");
        if (contentType.startsWith("image/")) {
            return client.sendMessage(
                m.chat,
                { image: { url: text } },
                { quoted: m }
            );
        }
        if (contentType.startsWith("video/")) {
            return client.sendMessage(
                m.chat,
                { video: { url: text } },
                { quoted: m }
            );
        }
        if (contentType.startsWith("audio/")) {
            return client.sendMessage(
                m.chat,
                { audio: { url: text } },
                { quoted: m }
            );
        }
        
        let alak = await ajg.buffer();
        try {
            alak = util.format(JSON.parse(alak + ""));
        } catch (e) {
            alak = alak + "";
        } finally {
            return NReply(alak.slice(0, 65536));
        }
    }
}
