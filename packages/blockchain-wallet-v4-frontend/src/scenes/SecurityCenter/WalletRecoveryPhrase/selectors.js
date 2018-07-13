import { selectors } from 'data'

export const getData = state => {
  const authType = selectors.core.settings.getAuthType(state)
  const isMnemonicVerified = selectors.core.wallet.isMnemonicVerified(state)

  return {
    authType,
    isMnemonicVerified
  }
}
