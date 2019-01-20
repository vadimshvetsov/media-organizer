const fs = require('fs');
const path = require('path');

const logger = require('./logger');

const { COPYFILE_EXCL } = fs.constants;

/**
 * Reproduce folders structure recursive inside destination folder and organize dedicated files inside model paths folders
 *
 * @param {object} props.structure - Folder structure with file pathes inside
 * @param {string} props.destination - Destination folder for structure reproducing
 */
const migrateToStructure = ({ structure, destination }) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }
  for (const folderName in structure) {
    const innerStructure = structure[folderName];
    if (Array.isArray(innerStructure)) {
      const finalFolder = path.join(destination, folderName);
      if (!fs.existsSync(finalFolder)) {
        fs.mkdirSync(finalFolder);
      }
      try {
        for (const filePath of innerStructure) {
          const newFilePath = path.join(finalFolder, path.basename(filePath));
          fs.copyFileSync(filePath, newFilePath, COPYFILE_EXCL);
          logger.info('%s was copied to destination %s', filePath, newFilePath);
        }
      } catch (err) {
        if (err.code === 'EEXIST') logger.warn('%s has already exist at %s', err.path, err.dest);
        else logger.error(err);
      }
    } else {
      migrateToStructure({
        structure: innerStructure,
        destination: path.join(destination, folderName),
      });
    }
  }
};

module.exports = migrateToStructure;
