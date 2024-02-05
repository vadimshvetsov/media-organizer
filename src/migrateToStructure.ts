import fs from 'fs'
import path from 'path'
import progress from 'progress-stream'

import { formatBytes } from './utils.js'
import { spinner } from './spinner.js'
import type { Structure } from './types.js'

/**
 * Reproduce folders structure recursive inside destination folder and organize dedicated files inside model paths folders
 */
export async function migrateToStructure({
  structure,
  destination,
}: {
  structure: Structure
  destination: string
}) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination)
  }
  for (const folderName in structure) {
    const innerStructure = structure[folderName]
    if (Array.isArray(innerStructure)) {
      const finalFolder = path.join(destination, folderName)
      if (!fs.existsSync(finalFolder)) {
        spinner.text = `Creating folder at ${finalFolder}`
        fs.mkdirSync(finalFolder)
      }
      for (const filePath of innerStructure) {
        const fileStat = fs.statSync(filePath)
        const newFilePath = path.join(finalFolder, path.basename(filePath))

        const str = progress({
          length: fileStat.size,
          time: 100,
        })

        str.on('progress', ({ percentage, transferred, length }) => {
          spinner.text = `${Math.floor(percentage)}% (${formatBytes(transferred)}/${formatBytes(
            length,
          )}) - ${path.basename(filePath)} >>> ${finalFolder}`
        })

        const readStream = fs.createReadStream(filePath)
        const writeStream = fs.createWriteStream(newFilePath, { flags: 'wx' })

        const finishWriteStream = () =>
          new Promise<void>((resolve, reject) => {
            writeStream.on('finish', () => {
              spinner.succeed(`${path.basename(filePath)} was copied to ${finalFolder}`).start()
              resolve()
            })
            writeStream.on('error', (err) => {
              if ('code' in err) {
                if (err.code === 'EEXIST') {
                  spinner
                    .warn(`${path.basename(filePath)} is already exists at ${finalFolder}`)
                    .start()
                  resolve()
                } else {
                  reject(err)
                }
              }
            })
            readStream.on('error', reject)
          })

        readStream.pipe(str).pipe(writeStream)
        await finishWriteStream()
        fs.utimesSync(newFilePath, fileStat.birthtime, fileStat.birthtime)
      }
    } else {
      await migrateToStructure({
        structure: innerStructure as unknown as Structure,
        destination: path.join(destination, folderName),
      })
    }
  }
}
