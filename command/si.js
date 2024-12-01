const { downloadContentFromMessage } = require('@adiwajshing/baileys');
const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'si',
    type: ['sticker'],
    description: '*Ubah Stiker yang Dibalas Menjadi Gambar*',
    async execute(client, m, args, NReply) {
        try {
            // Validasi apakah pesan yang dibalas adalah stiker
            const repliedMessage = m.message.extendedTextMessage ? m.message.extendedTextMessage.contextInfo : null;
            if (!repliedMessage || !repliedMessage.quotedMessage || !repliedMessage.quotedMessage.stickerMessage) {
                return NReply("Balas stiker dengan caption *.si* untuk mengubahnya menjadi gambar.");
            }

            // Unduh stiker dari pesan yang dibalas
            const stream = await downloadContentFromMessage(repliedMessage.quotedMessage.stickerMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // Lokasi file sementara untuk gambar
            const tempStickerPath = path.join(__dirname, 'temp_sticker.webp');
            fs.writeFileSync(tempStickerPath, buffer);

            // Kirim gambar kembali
            await client.sendMessage(m.key.remoteJid, {
                image: buffer,
                caption: 'Ini adalah gambar yang diubah dari stiker!',
            });

            // Hapus file sementara
            fs.unlinkSync(tempStickerPath);

        } catch (error) {
            console.error(error);
            NReply("Terjadi kesalahan saat memproses stiker. Pastikan Anda membalas stiker dengan benar.");
        }
    }
};
