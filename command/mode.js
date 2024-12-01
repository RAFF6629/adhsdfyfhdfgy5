module.exports = {
    command: 'mode',
    type: ['owner'],
    description: '*self/public*',
    async execute(client, m, args, NReply, Access) {
        if (!Access) return NReply('only my owner can access this feature lol 🗣️.');   
        const mode = args[0];
        
        if (mode === 'public') {
            client.public = true;
            NReply('_successfully set to *public* mode_');
        } else if (mode === 'self') {
            client.public = false;
            NReply('_successfully set to *self* mode_');
        } else {
            NReply('Invalid mode. Use ".mode public" or ".mode self".');
        }
    }
};