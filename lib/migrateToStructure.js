const fs = require('fs');
const mv = require('mv');
const path = require('path');
const progress = require('progress-stream');

const { formatBytes } = require('./utils');
const spinner = require('./spinner');

/**
 * Reproduce folders structure recursive inside destination folder and organize dedicated files inside model paths folders
 *
 * @param {object} props.structure - Folder structure with file pathes inside
 * @param {string} props.destination - Destination folder for structure reproducing
 * @param {boolean} props.isMove - If true moves file instead of copy
 */
const migrateToStructure = async ({ structure, destination, isMove = false }) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }
  for (const folderName in structure) {
    const innerStructure = structure[folderName];
    if (Array.isArray(innerStructure)) {
      const finalFolder = path.join(destination, folderName);
      if (!fs.existsSync(finalFolder)) {
        spinner.text = `Creating folder at ${finalFolder}`;
        fs.mkdirSync(finalFolder);
      }
      for (const filePath of innerStructure) {
        const fileStat = fs.statSync(filePath);
        const newFilePath = path.join(finalFolder, path.basename(filePath));

        if (isMove) {
          mv(filePath, newFilePath, err => {
            if (err) {
              if (err.code === 'EEXIST') {
                spinner
                  .warn(`${path.basename(filePath)} is already exists at ${finalFolder}`)
                  .start();
              } else {
                throw err;
              }
            }
            spinner.succeed(`${path.basename(filePath)} was copied to ${finalFolder}`).start();
          });
        } else {
          const str = progress({
            length: fileStat.size,
            time: 100,
          });

          str.on('progress', ({ percentage, transferred, length }) => {
            spinner.text = `${Math.floor(percentage)}% (${formatBytes(transferred)}/${formatBytes(
              length,
            )}) - ${path.basename(filePath)} >>> ${finalFolder}`;
          });

          const readStream = fs.createReadStream(filePath);
          const writeStream = fs.createWriteStream(newFilePath, { flags: 'wx' });

          const finishWriteStream = () =>
            new Promise((resolve, reject) => {
              writeStream.on('finish', () => {
                spinner.succeed(`${path.basename(filePath)} was copied to ${finalFolder}`).start();
                resolve();
              });
              writeStream.on('error', err => {
                if (err.code === 'EEXIST') {
                  spinner
                    .warn(`${path.basename(filePath)} is already exists at ${finalFolder}`)
                    .start();
                  resolve();
                } else {
                  reject(err);
                }
              });
              readStream.on('error', reject);
            });

          readStream.pipe(str).pipe(writeStream);
          await finishWriteStream();
        }
      }
    } else {
      await migrateToStructure({
        structure: innerStructure,
        destination: path.join(destination, folderName),
        isMove,
      });
    }
  }
};

module.exports = migrateToStructure;
