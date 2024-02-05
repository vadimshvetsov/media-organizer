#!/usr/bin/env node
import path from 'path'
import { Command } from 'commander'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const packageJson = require('../package.json')

import { getStructure } from './getStructure.js'
import { spinner } from './spinner.js'
import { migrateToStructure } from './migrateToStructure.js'

const program = new Command()

program
  .version(packageJson.version, '-v, --version')
  .usage('<source path> <target path>')
  .parse(process.argv)

if (program.args.length > 0) {
  copyFiles()
}

async function copyFiles() {
  spinner.start()

  const location = path.resolve(process.cwd(), program.args[0])
  const destination = path.resolve(process.cwd(), program.args[1])

  try {
    spinner.text = 'Preparing folders structure'
    const structure = await getStructure({ location })
    spinner.text = 'Copying files to destination'
    await migrateToStructure({ destination, structure })
  } catch (err) {
    if (err instanceof Error) {
      spinner.fail(err.message)
    }
  }

  spinner.stop()
}
