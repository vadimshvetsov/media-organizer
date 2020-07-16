const fs = require('fs');
const path = require('path');
const util = require('util');
const R = require('ramda');

const spinner = require('./spinner');

/**
 * Find all files inside a dir, recursively
 *
 * @param  {string} dir - Dir path string.
 * @return {string[]} Array with all file names that are inside the directory
 */
const getAllFiles = dir =>
  fs.readdirSync(dir).reduce((files, file) => {
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
const getDateString = date => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};

module.exports.getDateString = getDateString;

/**
 * Get inner path by diffing rule metadata with file metadata
 *
 * @param  {Object} props.metadata - EXIF media information
 * @param  {Object[]} props.rules - Rules of pathes with metadata
 * @return {string[]} Array of strings for path
 */
const getInnerPath = ({ metadata, rules }) => {
  const rule = R.find(rule => R.whereEq(rule.metadata)(metadata), rules);
  if (!rule) {
    spinner.info(util.inspect(metadata, { depth: null, showHidden: false, colors: true })).start();
    throw new Error(`Try to match the metadata above with rule inside your config file to proceed`);
  }
  return rule.path;
};

module.exports.getInnerPath = getInnerPath;

/**
 * Format bytes to readable string
 *
 * @param {number} bytes - Raw bytes size
 * @returns {string} Returns formatted string
 */
const formatBytes = bytes => {
  if (bytes === 0) return '0 Bytes';
  const kiloByte = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(kiloByte));
  return parseFloat((bytes / Math.pow(kiloByte, i)).toFixed(2)) + ' ' + sizes[i];
};

module.exports.formatBytes = formatBytes;
