declare module 'exiftool' {
  type MetadataValue = string | number

  interface Metadata {
    [key: string]: MetadataValue
  }

  type MetadataCallback = (error: string | null, metadata?: Metadata) => void

  interface ExifToolProcess extends NodeJS.Process {
    stdin: NodeJS.WritableStream
    stdout: NodeJS.ReadableStream
    stderr: NodeJS.ReadableStream
    on(event: 'exit', listener: (code: number | null, signal: NodeJS.Signals | null) => void): this
  }

  export function metadata(
    source: string | Buffer,
    tagsOrCallback?: string[] | MetadataCallback,
    doneGettingMetadata?: MetadataCallback,
  ): ExifToolProcess
}
