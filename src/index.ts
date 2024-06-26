import { argsParser } from "./lib/argsParser"
import { httpClient } from "./lib/httpClient"
import { jsonConverter } from "./lib/jsonConverter"
import { jsonReader } from "./lib/jsonReader"
import { urlConverter } from "./lib/urlConverter"

const { file, gap, method, header, data, path, params, root, query, comment } = argsParser.parseArgs(Bun.argv)

if (file) {
  const jsonObject = await jsonReader.read(file)
  const converter = new jsonConverter(options => {
    options.gap = parseInt(gap as string)
    options.comment = comment ?? ""
  })
  const schema = converter.convert(jsonObject)
  console.log(schema)
}

else {
  if (!method) {
    console.error("Method is required")
    process.exit(1)
  }

  if (!path) {
    console.error("Path is required")
    process.exit(1)
  }

  if (!root) {
    console.error("Root is required")
    process.exit(1)
  }

  let reqData: any
  if (data) {
    reqData = await jsonReader.read(data)
  }
  const converter = new urlConverter(method, root, path, options => {
    if (header) {
      options.header = header
    }

    if (data) {
      options.data = reqData
    }

    if (params) {
      options.params = params
    }

    if (query) {
      options.query = query
    }
    options.gap = parseInt(gap as string)
    options.comment = comment ?? ""
  })

  const schema = await converter.convert(new httpClient())
  console.log(schema)
}





