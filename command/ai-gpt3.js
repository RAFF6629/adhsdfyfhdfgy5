const { gpt3 } = require('../start/lib/scrape/scrape-gpt3');

module.exports = {
    command: 'gpt3',
    type: ['artificial intelligence'],
    description: '*query*',
    async execute(client, m, args, NReply) {
        const text = args.join(" ");
        if (!text) return NReply('want to ask about what? *Example*: What is a bug in the Application');
        let res = await gpt3(text);
        let puqi = res.data;
        client.sendMessage(m.chat, { 
            text : `*Query  :* ${puqi.content}\n*Answer*  :* ${puqi.reply}`
        },{quoted: m});
    }
};
