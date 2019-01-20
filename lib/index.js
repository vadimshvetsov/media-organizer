#!/usr/bin/env node
const program = require('commander');
const path = require('path');

const packageJson = require('../package.json');
const getStructure = require('./getStructure');
const migrateToStructure = require('./migrateToStructure');

program
  .version(packageJson.version, '-v, --version')
  .option('-c, --config <path>', 'Set config json file path')
  .usage('[options] <filepath>')
  .parse(process.argv);

if (program.args.length > 0) {
  (async function() {
    const location = path.resolve(process.cwd(), program.args[0]);
    const destination = path.resolve(process.cwd(), program.args[1]);
    const config = path.resolve(process.cwd(), program.config);

    const structure = await getStructure({ location, config });
    migrateToStructure({ destination, structure });
  })();
}
