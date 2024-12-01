const axios = require('axios');

module.exports = {
    command: 'ytsearch',
    type: ['search'],
    description: '*Search for YouTube videos*',
    async execute(client, m, args, NReply) {
        const query = args.join(' ');
        if (!query) return NReply('What video do you want to search for? Example: .ytsearch jujutsu kaisen');

        // Your YouTube Data API key
        const YOUTUBE_API_KEY = 'AIzaSyC0etCTzfywabIaHI9w-kRuIfy-uD7psKE';
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;

        try {
            const response = await axios.get(apiUrl);
            const videos = response.data.items;

            if (videos.length === 0) {
                return NReply('No videos found for your query.');
            }

            // Prepare the response message
            let resultMessage = '*Search Results:*\n\n';
            videos.slice(0, 5).forEach((video, index) => {
                const { title, channelTitle } = video.snippet;
                const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
                resultMessage += `${index + 1}. *${title}*\nChannel: ${channelTitle}\nLink: ${videoUrl}\n\n`;
            });

            NReply(resultMessage);
        } catch (error) {
            console.error(error);
            NReply('An error occurred while searching for videos.');
        }
    },
};
