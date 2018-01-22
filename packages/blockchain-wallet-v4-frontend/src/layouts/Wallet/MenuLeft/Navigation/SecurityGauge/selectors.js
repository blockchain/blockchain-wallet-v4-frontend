import { selectors } from 'data'

export const getSecurityGauge = (state) => {
  const isEmailVerified = selectors.core.settings.getEmailVerified(state)
  const isMnemonicVerified = selectors.core.wallet.isMnemonicVerified(state)
  const isMobileVerified = selectors.core.settings.getSmsVerified(state)
  const isPasswordHintEnabled = selectors.core.settings.getHint(state) ? 1 : 0
  const isTwoFactorEnabled = selectors.core.settings.getAuthType(state) > 0 ? 1 : 0
  const isBlockTorIpsEnabled = selectors.core.settings.getBlockTorIps(state)

  return {
    score: isEmailVerified + isMnemonicVerified + isMobileVerified + isPasswordHintEnabled + isTwoFactorEnabled + isBlockTorIpsEnabled
  }
}
