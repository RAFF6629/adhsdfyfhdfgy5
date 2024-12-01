const axios = require('axios'); // Untuk request HTTP

module.exports = {
    command: 'play',
    type: ["search"], 
    description: '*Search and Play from Deezer*',
    async execute(client, m, args, NReply) {
        const text = args.join(" ");
        if (!text) return NReply(`What song do you want to play? *Example*: .play wide awake`);
        
        try {
            // Deezer API Endpoint
            const API_URL = `https://api.deezer.com/search?q=${encodeURIComponent(text)}`;
            
            // Cari lagu di Deezer
            const response = await axios.get(API_URL);
            const tracks = response.data.data;

            if (!tracks || tracks.length === 0) {
                return NReply(`Sorry, I couldn't find any song with that title.`);
            }

            // Ambil data lagu pertama
            const track = tracks[0];
            const songTitle = track.title;
            const artist = track.artist.name;
            const audioUrl = track.preview; // URL audio preview (30 detik)
            const thumbnail = track.album.cover_medium;

            // Kirim audio ke pengguna
            client.sendMessage(m.chat, { 
                audio: { url: audioUrl },
                mimetype: "audio/mpeg",
                fileName: `${songTitle}.mp3`,
                contextInfo: {
                    forwardingScore: 99999999999,
                    isForwarded: true,
                    externalAdReply: {
                        showAdAttribution: true,
                        containsAutoReply: true,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        title: songTitle,
                        body: artist,
                        previewType: "PHOTO",
                        thumbnailUrl: thumbnail
                    }
                }
            }, { quoted: m });
        } catch (error) {
            console.error(error);
            NReply('An error occurred while processing your request. Please try again.');
        }
    }
};
