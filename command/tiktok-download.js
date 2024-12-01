const axios = require('axios');

module.exports = {
    command: 'tiktok',
    type: ['download'],
    description: '*provide Tiktok URL*',
    async execute(client, m, args, NReply) {
        const text = args.join(" ");
        if (!text) return NReply("Where is the TikTok URL? *Example :* .tiktok https://");

        // Define the API request options
        const options = {
            method: 'GET',
            url: 'https://tiktok-api23.p.rapidapi.com/api/download/video',
            params: {
                url: text,  // TikTok URL provided by the user
            },
            headers: {
                'x-rapidapi-key': 'f118c22c4amsh6611274a7c66decp10cc71jsn29d5705ff58d', // Your RapidAPI Key
                'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com'
            }
        };

        try {
            // Send the API request to fetch TikTok data
            const response = await axios.request(options);
            
            // Log the response for debugging purposes
            console.log("API Response:", response.data);

            // Check if the response contains video data
            if (response.data && response.data.play) {
                const video_url = response.data.play;
                await client.sendMessage(m.chat, { video: { url: video_url }, caption: 'Here is the TikTok video!' }, { quoted: m });
            } else {
                console.log('No valid video found in the response:', response.data);
                NReply('No media found or an error occurred while retrieving media.');
            }
        } catch (error) {
            console.error('Error fetching TikTok data:', error);
            NReply('Failed to fetch media from TikTok. Please try again.');
        }
    }
};
