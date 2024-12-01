const axios = require('axios');

module.exports = {
    command: 'ttsearch',
    type: ['search'],
    description: '*Search TikTok videos*',
    async execute(client, m, args, NReply) {
        const query = args.join(' ');
        if (!query) return NReply('What video do you want to search for? Example: .ttsearch lucu');

        const options = {
            method: 'GET',
            url: 'https://tiktok-scraper7.p.rapidapi.com/feed/search',
            params: {
                keywords: query,
                region: 'id', // Region untuk Indonesia
                count: '10',
                cursor: '0',
                publish_time: '0',
                sort_type: '0'
            },
            headers: {
                'x-rapidapi-key': 'f118c22c4amsh6611274a7c66decp10cc71jsn29d5705ff58d', // Ganti dengan API Key Anda
                'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            console.log('API Response:', response.data); // Debugging untuk melihat respons API
        
            const results = response.data.data.videos; // Mengakses 'videos' dari 'data'
        
            if (results && results.length > 0) {
                const firstResult = results[0];
                const videoUrl = firstResult.play || firstResult.no_watermark; // Cek properti video URL
        
                await client.sendMessage(m.chat, {
                    video: { url: videoUrl },
                    caption: `🎥 *Title*: ${firstResult.desc}\n👤 *Author*: ${firstResult.author.nickname}\n🔗 *URL*: ${firstResult.share_url}`
                }, { quoted: m });
            } else {
                await client.sendMessage(m.chat, { text: 'No results found for this search.' }, { quoted: m });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            NReply('An error occurred while fetching TikTok videos. Please try again later.');
        }
        
    }
};
