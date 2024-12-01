const axios = require('axios');

async function tiktokdl(url) {
    try {
        const response = await axios.post('https://shinoa.us.kg/api/download/tiktok', {
            text: url
        }, {
            headers: {
                'accept': '*/*',
                'api_key': 'kyuurzy',
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error downloading TikTok video:', error);
        throw error; 
    }
}

module.exports = { tiktokdl }