import fs from 'fs'
import path from 'path'
import util from 'util'
import exif from 'exiftool'

// TODO getAllFilenames
export function getAllFiles(dir: string): string[] {
  return fs.readdirSync(dir).reduce((files: string[], file: string) => {
    const name = path.join(dir, file)
    const isDirectory = fs.statSync(name).isDirectory()
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
  }, [])
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const kiloByte = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(kiloByte))
  return parseFloat((bytes / Math.pow(kiloByte, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getDateString(originalDate: Date): string {
  const date = new Date(originalDate)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)

  return `${year}-${month}-${day}`
}

export async function getCreationDate(filePath: string): Promise<string[]> {
  const fileCreationDate = getDateString(fs.statSync(filePath).birthtime).split('-')

  const metadata = await util.promisify(exif.metadata)(filePath)

  if (!metadata || metadata.error) {
    return fileCreationDate
  }

  if ('creationDate' in metadata && typeof metadata.creationDate === 'string') {
    return metadata.creationDate.slice(0, 10).split(':')
  }

  if ('createDate' in metadata && typeof metadata.createDate === 'string') {
    return metadata.createDate.slice(0, 10).split(':')
  }

  return fileCreationDate
}
