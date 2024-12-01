const axios = require('axios');

module.exports = {
    command: 'ytmp4',
    type: ['download'],
    description: '*Provide YouTube Video URL to download MP4*',
    async execute(client, m, args, NReply) {
        const url = args.join(" ");
        if (!url) return NReply("Where is the YouTube URL? *Example :* .ytmp4 https://youtu.be/UxxajLWwzqY");

        const encodedParams = new URLSearchParams();
        encodedParams.set('url', url); // Menggunakan URL langsung dari input pengguna

        const options = {
            method: 'POST',
            url: 'https://snap-video3.p.rapidapi.com/download',
            headers: {
                'x-rapidapi-key': 'f118c22c4amsh6611274a7c66decp10cc71jsn29d5705ff58d', // Ganti dengan API Key Anda
                'x-rapidapi-host': 'snap-video3.p.rapidapi.com',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: encodedParams
        };

        try {
            const response = await axios.request(options);

            // Pastikan ada URL unduhan video dalam respon
            if (response.data && response.data.url) {
                const videoUrl = response.data.url; // URL video MP4
                const title = response.data.title || 'Downloaded Video'; // Judul video

                // Kirim video ke pengguna di WhatsApp
                await client.sendMessage(m.chat, {
                    video: { url: videoUrl },
                    caption: `🎥 *Title:* ${title}\n✅ Successfully downloaded the MP4 file!`
                }, { quoted: m });
            } else {
                NReply("Sorry, I couldn't retrieve the MP4 link. Please check the YouTube URL and try again.");
            }
        } catch (error) {
            console.error(error);
            NReply("An error occurred while processing your request. Please try again later.");
        }
    }
};
