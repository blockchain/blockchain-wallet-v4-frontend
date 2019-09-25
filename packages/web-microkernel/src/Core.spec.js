import { EventTarget, MockWindow } from './mocks'
import Core from './Core.js'

function ErrorEvent (type, properties) {
  this.type = type
  this.properties = properties
}

let counter = 0

const getRandomValues = typedArray => {
  typedArray.fill(counter)
  counter++
}

const core = Core({ ErrorEvent, EventTarget, getRandomValues })

it(`stringifies a value for debugging`, () => {
  expect(
    core.inspect([{ a: `This is a very, very, very long string.` }])
  ).toEqual(`[{"a":"This is a very, very, very long s...`)
})

const windowMethods = ({ source, windows }) => ({
  addListener: listener => source.addEventListener(`message`, listener),

  postMessage: (processName, message) => {
    // console.log(`${source.name} -> ${processName}`, JSON.stringify(message))
    windows.get(processName).postMessage(message, `*`, [], source)
  }
})

// Create two test windows and serialize a value across them.
const serialize = async (exports, { reviver } = {}) =>
  new Promise(async (resolve, reject) => {
    let childWindow
    let name
    const rootWindow = MockWindow(`root`)
    const windows = new Map([[null, rootWindow]])

    const insertHTML = html => {
      name = html.match(/name="(.+)"/)[1]
      childWindow = MockWindow(name)
      windows.set(name, childWindow)
      return { contentWindow: childWindow }
    }

    const rootProcess = core.RootProcess({
      ...windowMethods({ source: rootWindow, windows }),
      hide: () => {},
      insertHTML,
      reviver,
      show: () => {}
    })

    rootProcess.addEventListener(`error`, reject)
    const childProcessFunctionPromise = rootProcess.createProcess(``)

    const childProcess = core.ChildProcess(
      {
        ...windowMethods({ source: childWindow, windows }),
        processName: name,
        reviver
      },
      () => exports
    )

    childProcess.addEventListener(`error`, reject)
    const childProcessFunction = await childProcessFunctionPromise

    resolve({
      childProcess,
      rootProcess,
      value: await childProcessFunction()
    })
  })

describe(`serializes values across realm boundaries`, () => {
  it(`creates consistent object references`, async () => {
    const object = { a: 1, b: 2, c: 3 }
    const exports = [object, object]
    const { value } = await serialize(exports)
    const [left, right] = value
    expect(left).toBe(right)
  })

  it(`freezes serialized values`, async () => {
    const exports = [{ a: 1 }]
    const { value } = await serialize(exports)
    expect(Object.isFrozen(value)).toEqual(true)
    expect(Object.isFrozen(value[0])).toEqual(true)
  })

  it(`toJSON`, async () => {
    const wat = Symbol(`wat`)

    const exports = {
      value: wat,

      toJSON: () => ({
        type: `symbol`,
        description: `wat`
      })
    }

    const reviver = (key, value) =>
      Object(value) === value &&
      value.type === `symbol` &&
      value.description === `wat`
        ? wat
        : value

    const { value } = await serialize(exports, { reviver })
    expect(value).toEqual(wat)
  })

  it(`unsupported type`, async () => {
    await expect(serialize(Symbol(`description`))).rejects.toEqual({
      error: new Error(`Exception while encoding "Symbol(description)"`),
      message: 'Exception while encoding "Symbol(description)"'
    })
  })

  describe(`types`, () => {
    it(`array`, async () => {
      const exports = [1, 2, 3]
      const { value } = await serialize(exports)
      expect(value).toEqual(exports)
    })

    it(`boolean`, async () => {
      const exports = true
      const { value } = await serialize(exports)
      expect(value).toEqual(exports)
    })

    it(`Error`, async () => {
      const exports = Error(`message`)
      exports.name = `name`

      // Axios adds extra properties to errors.
      exports.extra = `extra`

      const { value } = await serialize(exports)
      expect(value instanceof Error).toEqual(true)
      expect(value).toEqual(exports)
    })

    describe(`function`, () => {
      it(`has the same arguments length`, async () => {
        const exports = (a, b) => a + b
        const { value } = await serialize(exports)
        expect(value.length).toEqual(exports.length)
      })

      it(`encodes arguments`, async () => {
        const exports = async (a, b) => [a, b]
        const { value } = await serialize(exports)
        const object = {}
        const [serializedA, serializedB] = await value(object, object)
        expect(serializedA).not.toBe(object)
        expect(serializedA).toBe(serializedB)
      })

      it(`returns value`, async () => {
        const exports = async (a, b) => a + b
        const { value } = await serialize(exports)
        expect(await value(1, 2)).toEqual(3)
      })

      it(`allows functions only within exports`, async () => {
        const compose = async (f, g) => x => f(g(x))
        const { rootProcess, value } = await serialize(compose)

        const errorPromise = new Promise(resolve => {
          rootProcess.addEventListener(`error`, resolve)
        })

        const winner = await Promise.race([
          value(Math.cos, Math.sin),
          errorPromise
        ])

        expect(winner.error.exception.message).toEqual(
          `Refusing to encode functions outside of exported function.`
        )
      })

      it(`consistent identity`, async () => {
        const func = async (a, b) => a + b
        const exports = [func, func]
        const { value } = await serialize(exports)
        const [left, right] = value
        expect(left).toBe(right)
      })

      it(`throws exception`, async () => {
        const exports = async () => {
          throw new Error(`a tantrum`)
        }

        const { value } = await serialize(exports)
        await expect(value()).rejects.toEqual(new Error(`a tantrum`))
      })
    })

    it(`map`, async () => {
      const exports = new Map([[`a`, 1], [`b`, 2], [`c`, 3]])
      const { value } = await serialize(exports)
      expect(value).toEqual(exports)
    })

    it(`null`, async () => {
      const exports = null
      const { value } = await serialize(exports)
      expect(value).toEqual(exports)
    })

    it(`number`, async () => {
      const exports = 42
      const { value } = await serialize(exports)
      expect(value).toEqual(exports)
    })

    it(`object`, async () => {
      const exports = { a: 1, b: 2, c: 3 }
      const { value } = await serialize(exports)
      expect(value).toEqual(exports)
    })

    it(`set`, async () => {
      const exports = new Set([1, 2, 3])
      const { value } = await serialize(exports)
      expect(value).toEqual(exports)
    })

    it(`undefined`, async () => {
      const exports = undefined
      const { value } = await serialize(exports)
      expect(value).toEqual(exports)
    })
  })
})

describe(`sanitize`, () => {
  it(`canSerialize`, () => {
    expect(core.canSerialize(42)).toEqual(true)
    expect(core.canSerialize(Symbol(`description`))).toEqual(false)
  })

  it(`removes non-serializable types`, () => {
    expect(core.sanitize(Math.sin)).toEqual(null)
    expect(core.sanitize({ a: 1, b: Math.sin })).toEqual({ a: 1 })
    expect(core.sanitize([Math.sin])).toEqual([])
  })

  it(`is mutable`, () => {
    const immutable = Object.freeze({ a: { b: 1 } })
    const mutable = core.sanitize(immutable)
    mutable.a.b = 2
    expect(mutable.a.b).toEqual(2)
  })

  it(`error`, () => {
    const error = Object.assign(new Error(`message`), {
      answer: 42,
      sin: Math.sin
    })

    const sanitized = core.sanitize(error)
    expect(sanitized instanceof Error).toEqual(true)

    expect(Object.entries(sanitized)).toEqual(
      Object.entries(Object.assign(new Error(`message`), { answer: 42 }))
    )
  })

  it(`sanitizes functions`, async () => {
    const trickyFunction = async value => ({
      ...value,
      sin: Math.sin
    })

    expect(
      await core.sanitizeFunction(trickyFunction)({
        answer: 42,
        cos: Math.cos
      })
    ).toEqual({ answer: 42 })
  })
})
