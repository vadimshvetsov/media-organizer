#!/usr/bin/env node
const program = require('commander');
const path = require('path');

const packageJson = require('../package.json');
const getStructure = require('./getStructure');
const migrateToStructure = require('./migrateToStructure');
const spinner = require('./spinner');

program
  .version(packageJson.version, '-v, --version')
  .option('-c, --config <path>', 'Set config json file path')
  .option('-d, --default <video | image>', 'Set default library config json for image or video')
  .usage('[options] <source path> <target path>')
  .parse(process.argv);

if (program.args.length > 0) {
  (async function() {
    const location = path.resolve(process.cwd(), program.args[0]);
    const destination = path.resolve(process.cwd(), program.args[1]);
    const config = program.config
      ? path.resolve(process.cwd(), program.config)
      : program.default === 'image'
      ? path.resolve(__dirname, 'configs', 'default_image_config.json')
      : path.resolve(__dirname, 'configs', 'default_video_config.json');
    try {
      spinner.text = 'Preparing folders structure';
      const structure = await getStructure({ location, config });
      spinner.text = 'Copying files to destination';
      await migrateToStructure({ destination, structure });
    } catch (err) {
      spinner.fail(err.message);
    }
    spinner.stop();
  })();
}
