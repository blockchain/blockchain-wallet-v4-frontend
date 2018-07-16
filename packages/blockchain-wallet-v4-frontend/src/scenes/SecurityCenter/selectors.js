import { selectors } from 'data'

export const getData = (state) => ({
  authType: selectors.core.settings.getAuthType(state),
  emailVerified: selectors.core.settings.getEmailVerified(state),
  isMnemonicVerified: selectors.core.wallet.isMnemonicVerified(state)
})
