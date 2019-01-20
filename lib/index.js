#!/usr/bin/env node
const program = require('commander');

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
    const [location, destination] = program.args;
    const { config } = program;
    const structure = await getStructure({ location, config });
    migrateToStructure({ destination, structure });
  })();
}
