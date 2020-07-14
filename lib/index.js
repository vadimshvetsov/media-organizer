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
  .usage('[options] <source path> <target path>')
  .parse(process.argv);

if (program.args.length > 0) {
  (async function() {
    const location = path.resolve(process.cwd(), program.args[0]);
    const destination = path.resolve(process.cwd(), program.args[1]);
    const config = program.config
      ? path.resolve(process.cwd(), program.config)
      : path.resolve(__dirname, 'default_config.json');
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
