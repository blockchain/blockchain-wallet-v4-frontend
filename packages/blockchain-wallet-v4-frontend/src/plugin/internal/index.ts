/**
 * Exposes all internal plugin logic that may be used inside application.
 */
export class AbstractPlugin {
  // Indicates if application is chrome browser extension.
  public static isPlugin(): boolean {
    return window.location.protocol === 'chrome-extension:'
  }
}

export type TabMetadata = {
  favicon?: string
  origin: string
}

export async function addConnection(domain: string): Promise<void> {
  if (!domain) {
    throw Error("domain can't be empty")
  }

  const { connections } = await chrome.storage.local.get('connections')
  if (!connections) {
    await chrome.storage.local.set({ connections: [domain] })
    return
  }

  if (connections.includes(domain)) {
    return
  }

  connections.push(domain)
  await chrome.storage.local.set({ connections })
}

export async function removeConnection(domain: string): Promise<void> {
  if (!domain) {
    throw Error("domain can't be empty")
  }

  let { connections } = await chrome.storage.local.get('connections')
  if (!connections) {
    throw Error('provided domain is not connected')
  }

  connections = connections.filter((el: string) => el !== domain)
  await chrome.storage.local.set({ connections })
}

export async function removeAllConnections(): Promise<void> {
  await chrome.storage.local.set({ connections: [] })
}

export async function isDomainConnected(domain: string): Promise<boolean> {
  if (!domain) {
    throw Error("domain can't be empty")
  }

  const { connections } = await chrome.storage.local.get('connections')
  if (!connections) {
    return false
  }

  return connections.includes(domain)
}

export async function getConnectionsList(): Promise<string[]> {
  const { connections } = await chrome.storage.local.get('connections')
  if (!connections) {
    return []
  }

  return connections
}
