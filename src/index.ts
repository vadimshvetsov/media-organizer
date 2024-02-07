#!/usr/bin/env node
import path from 'path'
import { Command } from 'commander'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const packageJson = require('../package.json')

import { copyFiles } from './copyFiles.js'

const program = new Command()

program
  .version(packageJson.version, '-v, --version')
  .usage('<source path> <target path>')
  .parse(process.argv)

if (program.args.length > 0) {
  const location = path.resolve(process.cwd(), program.args[0])
  const destination = path.resolve(process.cwd(), program.args[1])

  copyFiles(location, destination)
}
