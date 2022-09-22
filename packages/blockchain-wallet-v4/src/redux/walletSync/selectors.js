export const getWalletSessions = (state) => {
  return state.session.wallet
}

export const getWalletSessionId = (state, guid, email) => {
  const guidMatches = guid && getWalletSessions(state)?.guid === guid
  const emailMatches = email && getWalletSessions(state)?.email === email
  if (guidMatches || emailMatches) {
    return getWalletSessions(state)?.id
  }
}
