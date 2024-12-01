const axios = require('axios');

async function ytdl(url) {
    const options = {
        method: 'GET',
        url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/',
        params: {
            url: url
        },
        headers: {
            'x-rapidapi-key': 'f118c22c4amsh6611274a7c66decp10cc71jsn29d5705ff58d', // Ganti dengan API key Anda
            'x-rapidapi-host': 'youtube-mp3-downloader2.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        // Mengecek apakah data dan link ditemukan
        if (response.data && response.data.link) {
            return response.data;  // Mengembalikan data yang berisi link MP3
        } else {
            throw new Error('No MP3 link found.');
        }
    } catch (error) {
        console.error('Error fetching MP3:', error);
        throw new Error(`Error fetching MP3: ${error.message}`);
    }
}

module.exports = { ytdl }
