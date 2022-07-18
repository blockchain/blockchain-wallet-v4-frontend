export const getPassword = async (): Promise<string> => {
  const { password } = await chrome.storage.session.get('password')
  return password
}

export const savePassword = async (password: string): Promise<void> => {
  await chrome.storage.session.set({ password })
}
