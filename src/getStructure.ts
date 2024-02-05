import path from 'path'
import * as R from 'ramda'

import { getAllFiles, getCreationDate } from './utils.js'
import { spinner } from './spinner.js'
import type { Structure } from './types.js'

export async function getStructure({ location }: { location: string }): Promise<Structure> {
  const filePathes = getAllFiles(location)
  let structure = {}

  for (const filePath of filePathes) {
    if (path.basename(filePath).charAt(0) === '.') {
      spinner.warn(`Ignoring file ${path.basename(filePath)}`).start()
      continue
    }

    const dateFolder = await getCreationDate(filePath)

    structure = R.assocPath(
      [...dateFolder],
      [...R.pathOr([], [...dateFolder], structure), filePath],
      structure,
    )
  }

  return structure
}
