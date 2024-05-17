class options {
  gap: number

  constructor() {
    this.gap = 2
  }
}

export class swagConverter {
  _gap
  _schema = ""
  _offset = 0

  constructor(fn?: (options: options) => void) {
    const opt = new options()
    if (fn) {
      fn(opt)
    }
    this._gap = opt.gap
  }

  _init(isArray: boolean) {
    if (isArray) {
      this._writeLine('type: array')
      this._writeLine('items:')
      this._addOffset(1)
    }
    else {
      this._writeLine('type: object')
      this._writeLine('properties:')
      this._addOffset(1)
    }
  }

  _writeLine(content: string) {
    this._schema += `${this._offsetter()}${content}\n`
  }

  _offsetter() {
    return " ".repeat(this._offset * this._gap)
  }

  _addOffset(count: number) {
    this._offset += count
  }

  _isDate(value: string) {
    return !isNaN(Date.parse(value))
  }

  _addProperty(key: string, value: any) {
    const valueType = typeof value

    switch (valueType) {
      case "object":
        this._writeLine(`${key}:`)
        this._addOffset(1)
        this._executeConversion(value)
        this._addOffset(-2)
        break
      case "string":
        this._writeLine(`${key}:`)
        this._addOffset(1)
        this._writeLine('type: string')
        this._addOffset(-1)
        if (this._isDate(value)) {
          this._addOffset(1)
          this._writeLine('format: date')
          this._addOffset(-1)
        }
        break
      case "number":
        this._writeLine(`${key}:`)
        this._addOffset(1)
        this._writeLine('type: number')
        this._addOffset(-1)
        break
      case "boolean":
        this._writeLine(`${key}:`)
        this._addOffset(1)
        this._writeLine('type: boolean')
        this._addOffset(-1)
        break
      default:
        this._writeLine(`${key}:`)
        this._addOffset(1)
        this._writeLine('type: undefined')
        this._addOffset(-1)
    }
  }

  _executeConversion(target: any) {
    const isArray = Array.isArray(target)
    this._init(isArray)
    const item = isArray ? target.length > 0 ? target[0] : undefined : target
    const itemType = typeof item

    switch (itemType) {
      case "object":
        if (isArray) {
          this._writeLine('type: object')
          this._writeLine('properties:')
          this._addOffset(1)
        }
        for (const key in item) {
          this._addProperty(key, item[key] ?? undefined)
        }
        break
      case "string":
        this._writeLine('type: string')
        break
      case "number":
        this._writeLine('type: number')
        break
      default:
        this._writeLine('type: undefined')
    }
  }

  toSchema(target: any) {
    this._executeConversion(target)
    return this._schema
  }
}