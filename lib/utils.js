const fs = require('fs');
const path = require('path');
const R = require('ramda');

const logger = ('./logger');

/**
 * Find all files inside a dir, recursively
 *
 * @param  {string} dir - Dir path string.
 * @return {string[]} Array with all file names that are inside the directory
 */
const getAllFiles = dir => fs.readdirSync(dir).reduce((files, file) => {
  const name = path.join(dir, file);
  const isDirectory = fs.statSync(name).isDirectory();
  return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
}, []);

module.exports.getAllFiles = getAllFiles;

/**
 * Get date string from date
 *
 * @param  {Date} date
 * @return {string} String in YYYY-MM-DD format
 */
const getDateString = date => new Date(date).toLocaleDateString(
  'ru-RU',
  {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
);

module.exports.getDateString = getDateString;

/**
 * Get inner path by diffing rule metadata with file metadata
 *
 * @param  {Object} props.metadata - EXIF media information
 * @param  {Object[]} props.rules - Rules of pathes with metadata
 * @return {string[]} Array of strings for path
 */
const getInnerPath = ({ metadata, rules }) => {
  const rule = R.find((rule) => R.whereEq(rule.metadata)(metadata), rules);
  if (!rule) {
    logger.error('%s/%s metadata doesn\'t fit any rule', metadata.directory, metadata.fileName, metadata);
    return [];
  }
  return rule.path;
};

module.exports.getInnerPath = getInnerPath;
