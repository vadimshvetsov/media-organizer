import { getStructure } from './getStructure.js'
import { spinner } from './spinner.js'
import { migrateToStructure } from './migrateToStructure.js'

export async function copyFiles(location: string, destination: string) {
  spinner.start()

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
