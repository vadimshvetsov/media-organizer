const fs = require('fs');
const path = require('path');
const util = require('util');
const exif = require('exiftool');
const R = require('ramda');

const utils = require('./utils');
const logger = require('./logger');

const { getAllFiles, getDateString, getInnerPath } = utils;

/**
 * Get file structure from folder location
 *
 * @param {string} props.location - Location folder path
 * @param {string} props.config - Config path
 * @returns {object} Structured object of folders for output directory
 */
const getStructure = async function ({ location, config }) {
  const rules = require(config).rules;
  const filePathes = getAllFiles(location);
  let structure = {};

  for (const filePath of filePathes) {
    const fileStats = fs.statSync(filePath);
    if (path.basename(filePath).charAt(0) === '.') {
      logger.warn('Ignoring file %s', filePath);
      continue;
    }
    try {
      const metadata = await util.promisify(exif.metadata)(filePath);
      if (metadata.error) {
        logger.error('File %s metadata has error', filePath, metadata.error);
      }
      const dateFolder = getDateString(fileStats.birthtime);
      const innerPath = getInnerPath({ metadata, rules });
      structure = R.assocPath(
        [dateFolder, ...innerPath],
        [...R.pathOr([], [dateFolder, ...innerPath], structure), filePath],
        structure,
      );
    } catch (err) {
      logger.error('Error during getting structure for %s', filePath, err);
      continue;
    }
  }

  return structure;
};

module.exports = getStructure;
