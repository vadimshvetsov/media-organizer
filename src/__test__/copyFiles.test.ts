import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'

import fs from 'fs'
import path from 'path'
import { copyFiles } from '../copyFiles.js'
import { getDateString } from '../utils.js'

describe('copyFiles function', () => {
  let sourceDir: string, destDir: string, fileName: string

  beforeEach(() => {
    // Create temporary directories
    sourceDir = '/tmp/source'
    destDir = '/tmp/destination'
    fs.mkdirSync(sourceDir, { recursive: true })

    // Create a temporary file in the source directory
    fileName = 'example.txt'
    fs.writeFileSync(path.join(sourceDir, fileName), 'Test content')
  })

  afterEach(() => {
    // Remove temporary directories and files
    fs.rmSync(sourceDir, { recursive: true, force: true })
    fs.rmSync(destDir, { recursive: true, force: true })
  })

  it('Copy file successfully with the same creation date', async () => {
    await copyFiles(sourceDir, destDir)

    const today = getDateString(new Date()).split('-')
    const sourcePath = path.join(sourceDir, fileName)
    const destPath = path.join(destDir, today[0], today[1], today[2], fileName)

    assert.strictEqual(fs.existsSync(destPath), true)
    assert.strictEqual(
      fs.statSync(sourcePath).birthtime.toString(),
      fs.statSync(destPath).birthtime.toString(),
    )
  })

  it('Copy file successfully with overwrite', async () => {
    const today = getDateString(new Date()).split('-')
    const sourcePath = path.join(sourceDir, fileName)
    const destFolderPath = path.join(destDir, today[0], today[1], today[2])
    const destPath = path.join(destFolderPath, fileName)

    fs.mkdirSync(destFolderPath, { recursive: true })
    fs.writeFileSync(
      path.join(destFolderPath, fileName),
      'Different content gives different filesize',
    )

    await copyFiles(sourceDir, destDir)

    assert.strictEqual(fs.existsSync(destPath), true)
    assert.strictEqual(
      fs.statSync(sourcePath).birthtime.toString(),
      fs.statSync(destPath).birthtime.toString(),
    )
  })
})
