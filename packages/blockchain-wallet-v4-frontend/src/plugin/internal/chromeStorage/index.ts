export const getPassword = async (): Promise<string> => {
  const { password } = await chrome.storage.session.get('password')
  return password
}

export const savePassword = async (password: string): Promise<void> => {
  await chrome.storage.session.set({ password })
}

export const setSessionExpireTime = async (): Promise<void> => {
  let sessionExpiresAt: string | Date = new Date()
  sessionExpiresAt.setHours(sessionExpiresAt.getHours() + 2)
  sessionExpiresAt = sessionExpiresAt.toString()
  await chrome.storage.local.set({ sessionExpiresAt })
}

export const getSessionPayload = async (): Promise<any> => {
  const { sessionPayload } = await chrome.storage.session.get('sessionPayload')
  return sessionPayload
}

export const isSessionActive = async (): Promise<boolean> => {
  const { sessionExpiresAt } = await chrome.storage.local.get('sessionExpiresAt')
  const { sessionPayload } = await chrome.storage.session.get('sessionPayload')
  return new Date(sessionExpiresAt) > new Date()
}

export const saveSessionPayload = async (sessionPayload: any): Promise<void> => {
  await chrome.storage.session.set({ sessionPayload })
}
