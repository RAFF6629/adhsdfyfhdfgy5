const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const folderPath = path.join(__dirname, '../../session');
const excludeFile = 'creds.json';

const deleteFiles = () => {
  fs.readdir(folderPath, (err, files) => {
    if (err) return console.error('Error reading directory:', err);

    files.forEach((file) => {
      if (file !== excludeFile) {
        fs.unlink(path.join(folderPath, file), (err) => {
          if (err) return console.error('Error deleting file:', err);
        });
      }
    });
  });
};

const startCronJob = () => {
  cron.schedule('*/60 * * * * *', deleteFiles); // Mengubah interval menjadi 35 detik
};

module.exports = startCronJob;
