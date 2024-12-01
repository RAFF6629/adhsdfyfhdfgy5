const axios = require('axios');

module.exports = {
    command: 'ig',
    type: ['download'],
    description: '*provide Instagram URL*',
    async execute(client, m, args, NReply) {
        const text = args.join(" ");
        if (!text) return NReply(`Where is the Instagram URL? *Example*: https://`);

        const options = {
            method: 'GET',
            url: 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/instagram',
            params: {
                url: text // Using the URL provided by the user
            },
            headers: {
                'x-rapidapi-key': 'f118c22c4amsh6611274a7c66decp10cc71jsn29d5705ff58d',
                'x-rapidapi-host': 'social-media-video-downloader.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const videoUrl = response.data.links[1].link; // Extracting the video URL from the response

            if (videoUrl) {
                const headResponse = await axios.head(videoUrl);
                const mimeType = headResponse.headers['content-type'];

                const isVideo = /video\/.*/.test(mimeType);

                if (isVideo) {
                    await client.sendMessage(m.chat, {
                        video: { url: videoUrl },
                        caption: "Successfully downloaded video from that URL"
                    }, { quoted: m });
                } else {
                    await client.sendMessage(m.chat, {
                        text: "Unsupported media type received."
                    }, { quoted: m });
                }
            } else {
                await client.sendMessage(m.chat, {
                    text: "No media found or an error occurred while retrieving media."
                }, { quoted: m });
            }
        } catch (error) {
            console.error('Error fetching media:', error);
            await client.sendMessage(m.chat, {
                text: "Error occurred while retrieving media."
            }, { quoted: m });
        }
    }
};
