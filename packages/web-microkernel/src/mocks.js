import structuredClone from 'realistic-structured-clone'

export function EventTarget() {
  const listeners = {}

  return {
    addEventListener: (type, listener) => {
      if (!(type in listeners)) {
        listeners[type] = new Set()
      }

      listeners[type].add(listener)
    },

    dispatchEvent: event => {
      const typeListeners = listeners[event.type] || new Set()
      ;[...typeListeners].forEach(listener => listener(event.properties))
    },

    removeEventListener: (type, listener) => {
      listeners[type].delete(listener)
    }
  }
}

export const MockWindow = name => {
  const target = new EventTarget()

  const postMessage = (message, targetOrigin, transfer, source) => {
    target.dispatchEvent({
      type: `message`,
      properties: { data: structuredClone(message), source }
    })
  }

  return { ...target, name, postMessage }
}
