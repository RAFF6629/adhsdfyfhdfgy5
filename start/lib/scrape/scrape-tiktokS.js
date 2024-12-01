const axios = require('axios');

async function tiktokSearch(query) {
    try {
        const response = await axios.post('https://shinoa.us.kg/api/search/tiktoksearch', {
            text: query
        }, {
            headers: {
                'accept': '*/*',
                'api_key': 'kyuurzy',
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error during API request:', error);
        throw error;
    }
}

module.exports = { tiktokSearch }