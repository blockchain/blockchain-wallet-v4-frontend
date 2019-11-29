import Core from './Core'
import EventTargetPolyfill from './EventTargetPolyfill'

let EventTargetImplementation = EventTarget

try {
  // This doesn't work on Safari.
  new EventTargetImplementation()
} catch {
  EventTargetImplementation = EventTargetPolyfill
}

const core = Core({
  ErrorEvent,
  EventTarget: EventTargetImplementation,
  getRandomValues: typedArray => window.crypto.getRandomValues(typedArray)
})

const tag = `web-microkernel`

const addListener = listener => {
  const multiplexed = ({ data: { data, type }, source }) => {
    if (type === tag) {
      listener({ data, source })
    }
  }

  window.addEventListener(`message`, multiplexed)
}

const postMessage = frames => (processName, message) => {
  const target = processName === null ? window.parent : frames[processName]
  const multiplexed = { type: tag, data: message }
  target.postMessage(multiplexed, `*`)
}

const ChildProcess = (options, exportedFunction) =>
  core.ChildProcess(
    {
      addListener,
      postMessage: postMessage(window.parent.frames),
      processName: window.name,
      ...options
    },
    exportedFunction
  )

const hide = element => {
  element.hidden = true
}

const insertHTML = HTML => {
  const body = document.body
  body.insertAdjacentHTML(`beforeend`, HTML)
  return body.lastChild
}

const show = element => {
  element.hidden = false
}

const RootProcess = options =>
  core.RootProcess({
    addListener,
    hide,
    insertHTML,
    postMessage: postMessage(window.frames),
    show,
    ...options
  })

const { sanitizeFunction } = core
export { ChildProcess, RootProcess, sanitizeFunction }
