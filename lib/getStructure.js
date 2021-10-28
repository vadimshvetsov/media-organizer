const fs = require('fs');
const path = require('path');
const util = require('util');
const exif = require('exiftool');
const R = require('ramda');

const { getAllFiles, getDateString, getInnerPath } = require('./utils');
const spinner = require('./spinner');

/**
 * Get file structure from folder location
 *
 * @param {string} props.location - Location folder path
 * @param {string} props.config - Config path
 * @param {string} props.log - Log path
 * @returns {object} Structured object of folders for output directory
 */
const getStructure = async function({ location, config, log }) {
  const rules = require(config).rules;
  const defaultFolder = require(config).defaultFolder;
  const filePathes = getAllFiles(location);
  let structure = {};

  for (const filePath of filePathes) {
    if (path.basename(filePath).charAt(0) === '.') {
      spinner.warn(`Ignoring file ${path.basename(filePath)}`).start();
      continue;
    }
    const metadata = await util.promisify(exif.metadata)(filePath);
    if (metadata.error) {
      throw new Error(`File ${filePath} metadata has error`);
    }
    const dateFolder = metadata.createDate
      ? metadata.createDate.slice(0, 10).split(':')
      : getDateString(fs.statSync(filePath).birthtime).split('-');
    const innerPath = getInnerPath({ metadata, rules, defaultFolder, log });

    structure = R.assocPath(
      [...dateFolder, ...innerPath],
      [...R.pathOr([], [...dateFolder, ...innerPath], structure), filePath],
      structure,
    );
  }

  return structure;
};

module.exports = getStructure;
