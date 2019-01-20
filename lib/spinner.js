const ora = require('ora');

const spinner = ora({ text: 'Starting media-organizer', spinner: 'arc' }).start();

module.exports = spinner;
