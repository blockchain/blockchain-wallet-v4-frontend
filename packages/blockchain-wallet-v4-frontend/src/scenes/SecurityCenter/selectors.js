import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const authTypeR = selectors.core.settings.getAuthType(state)
  const emailVerifiedR = selectors.core.settings.getEmailVerified(state)
  const isMnemonicVerified = selectors.core.wallet.isMnemonicVerified(state)

  return lift((authType, emailVerified) => {
    let emailComplete, twoFactorComplete
    let progress = 0
    if (authType > 0) {
      twoFactorComplete = authType > 0
      progress++
    }
    if (emailVerified > 0) {
      emailComplete = emailVerified > 0
      progress++
    }
    if (isMnemonicVerified) progress++
    return {
      twoFactorComplete,
      emailComplete,
      mnemonicComplete: isMnemonicVerified,
      overallProgress: progress
    }
  })(authTypeR, emailVerifiedR)
}
