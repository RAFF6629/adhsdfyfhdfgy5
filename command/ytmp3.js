const axios = require('axios');

module.exports = {
    command: 'ytmp3',
    type: ['download'],
    description: '*Provide YouTube URL*',
    async execute(client, m, args, NReply) {
        const text = args.join(" ");
        if (!text) return NReply("Where is the YouTube URL? *Example :* .ytmp3 https://youtu.be/");

        const options = {
            method: 'GET',
            url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/',
            params: {
                url: text
            },
            headers: {
                'x-rapidapi-key': 'f118c22c4amsh6611274a7c66decp10cc71jsn29d5705ff58d',
                'x-rapidapi-host': 'youtube-mp3-downloader2.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);

            // Check if the dlink property exists in the response
            if (response.data && response.data.dlink) {
                const mp3Url = response.data.dlink; // The MP3 download link is in 'dlink'

                // Send the MP3 file to the user
                await client.sendMessage(m.chat, {
                    audio: { url: mp3Url },
                    mimetype: 'audio/mpeg',
                    caption: "Successfully downloaded the MP3 file from YouTube"
                }, { quoted: m });
            } else {
                console.error('No MP3 link found in dlink');
                await client.sendMessage(m.chat, {
                    text: "Sorry, I couldn't retrieve the MP3 link."
                }, { quoted: m });
            }
        } catch (error) {
            console.error(error);
            await client.sendMessage(m.chat, {
                text: "An error occurred while downloading the MP3."
            }, { quoted: m });
        }
    }
};
