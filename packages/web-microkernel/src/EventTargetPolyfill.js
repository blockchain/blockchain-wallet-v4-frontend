export default function () {
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
