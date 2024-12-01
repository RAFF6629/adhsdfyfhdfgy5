const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas'); // Untuk membuat gambar dari teks

module.exports = {
    command: 'qc',
    type: ['sticker'],
    description: '*Ubah Chat Menjadi Stiker*',
    async execute(client, m, args, NReply) {
        try {
            // Ambil teks dari args atau pesan
            const text = args.join(' ') || m.message.conversation || m.message.extendedTextMessage?.text;
            if (!text) {
                return NReply("Harap masukkan teks untuk dijadikan stiker.\nContoh: *.qc Ini adalah stiker!*");
            }

            // Konfigurasi canvas
            const canvasWidth = 512;
            const canvasHeight = 512;
            const canvas = createCanvas(canvasWidth, canvasHeight);
            const ctx = canvas.getContext('2d');

            // Latar belakang
            ctx.fillStyle = '#ffffff'; // Warna putih
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Tambahkan teks
            ctx.fillStyle = '#000000'; // Warna teks (hitam)
            ctx.font = '28px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Pisahkan teks ke dalam baris jika terlalu panjang
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';

            for (const word of words) {
                const testLine = `${currentLine} ${word}`;
                const testWidth = ctx.measureText(testLine).width;

                if (testWidth > canvasWidth - 40) { // Margin 20px di setiap sisi
                    lines.push(currentLine.trim());
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine.trim());

            // Tampilkan teks pada canvas
            const lineHeight = 40;
            const totalHeight = lines.length * lineHeight;
            let startY = (canvasHeight - totalHeight) / 2;

            for (const line of lines) {
                ctx.fillText(line, canvasWidth / 2, startY);
                startY += lineHeight;
            }

            // Simpan canvas sebagai file gambar sementara
            const tempImagePath = path.join(__dirname, 'temp_text_image.png');
            const out = fs.createWriteStream(tempImagePath);
            const stream = canvas.createPNGStream();
            stream.pipe(out);

            await new Promise((resolve) => out.on('finish', resolve));

            // Buat stiker dengan wa-sticker-formatter
            const sticker = new Sticker(tempImagePath, {
                pack: 'RAFFBOT Quotes', // Nama paket stiker
                author: 'Dibuat Dengan: RAFFBOT', // Nama penerbit
                type: StickerTypes.FULL, // Jenis stiker (FULL/CROPPED)
                id: 'raffbot-quotes-id', // ID unik
                quality: 70 // Kualitas stiker
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
            NReply("Terjadi kesalahan saat memproses chat. Pastikan Anda memasukkan teks dengan benar.");
        }
    }
};
