const debounce = <T extends (...args: any[]) => any>(
  debouncedCallback: T,
  waitFor = 10000,
  maxCount = 10
) => {
  let timeout: ReturnType<typeof setTimeout>

  let counter = 0

  return (...args: Parameters<T>): ReturnType<T> => {
    let result: any

    if (timeout) clearTimeout(timeout)

    if (counter >= maxCount - 1) {
      counter = 0

      clearTimeout(timeout)

      return debouncedCallback(...args)
    }

    timeout = setTimeout(() => {
      counter = 0

      result = debouncedCallback(...args)
    }, waitFor)

    counter += 1

    return result
  }
}

const queueStorage = <K extends string, P extends {}>(queueName: string) => {
  if (!localStorage.getItem(queueName)) {
    localStorage.setItem(queueName, JSON.stringify([]))
  }

  const push = ({ key, payload }: { key: K; payload: P }) => {
    const rawStorage = localStorage.getItem(queueName)

    if (rawStorage === null) {
      throw new Error("Local storage doesn't exist")
    }

    const storage = JSON.parse(rawStorage)

    const newStorage = [...storage, { key, payload }]

    localStorage.setItem(queueName, JSON.stringify(newStorage))
  }

  const items = () => {
    const rawStorage = localStorage.getItem(queueName)

    if (rawStorage === null) {
      throw new Error("Local storage doesn't exist")
    }

    return JSON.parse(rawStorage)
  }

  const flush = () => {
    localStorage.setItem(queueName, JSON.stringify([]))
  }

  const values = {
    flush,
    items,
    push
  }

  return values
}

const queuevent = <K extends string, P extends {}>({
  queueCallback,
  queueName
}: {
  queueCallback: (events: { key: K; payload: P }[]) => Promise<void>
  queueName: string
}): {
  clear: () => void
  push: (key: K, payload: P) => void
} => {
  const queue = queueStorage<K, P>(queueName)

  const debouncedCallback = debounce(async (events: { key: K; payload: P }[]) => {
    await queueCallback(events)

    queue.flush()
  })

  const push = (key: K, payload: P) => {
    queue.push({ key, payload })

    const items = queue.items()

    debouncedCallback(items)
  }

  const clear = () => {
    const items = queue.items()

    if (items.length > 0) {
      debouncedCallback(items)

      queue.flush()
    }
  }

  const values = {
    clear,
    push
  }

  return values
}

export default queuevent
