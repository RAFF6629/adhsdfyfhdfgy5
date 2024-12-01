module.exports = {
    command: 'q',
    type: ['tools'],
    description: '*reply chat*',
    async execute(client, m, args, NReply) {
        if (!m.quoted) return NReply('Reply Message!!');

        let wokwol = await client.serializeM(await m.getQuotedObj());
        if (!wokwol.quoted) return NReply('The message you replied to does not contain a reply.');

        await wokwol.quoted.copyNForward(m.chat, true);
    }
}
