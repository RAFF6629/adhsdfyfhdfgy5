const { downloadContentFromMessage } = require('@adiwajshing/baileys');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require('fs');
const path = require('path');

module.exports = {
    command: 's',
    type: ['sticker'],
    description: '*Ubah Gambar Menjadi Stiker dengan Metadata*',
    async execute(client, m, args, NReply) {
        try {
            // Validasi jika tidak ada media
            if (!m.message.imageMessage) {
                return NReply("Kirim gambar dengan caption *.s* untuk mengubahnya menjadi stiker.");
            }

            // Unduh gambar dari pesan
            const stream = await downloadContentFromMessage(m.message.imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // Lokasi file sementara
            const tempImagePath = path.join(__dirname, 'temp_image.jpg');
            fs.writeFileSync(tempImagePath, buffer);

            // Buat stiker dengan metadata
            const sticker = new Sticker(tempImagePath, {
                pack: 'RAFFBOT Stickers', // Nama paket stiker
                author: 'Dibuat Dengan: RAFFBOT', // Nama penerbit
                type: StickerTypes.FULL, // Jenis stiker (FULL/CROPPED)
                categories: ['🔥', '✨'], // Emoji terkait
                id: 'raffbot-pack-id', // ID unik
                quality: 50 // Kualitas stiker
            });

            // Kirim stiker
            const stickerBuffer = await sticker.toBuffer();
            await client.sendMessage(m.key.remoteJid, {
                sticker: stickerBuffer,
            });

            // Hapus file sementara
            fs.unlinkSync(tempImagePath);

        } catch (error) {
            console.error(error);
            NReply("Terjadi kesalahan saat memproses gambar. Pastikan Anda mengirim gambar dengan benar.");
        }
    }
};
