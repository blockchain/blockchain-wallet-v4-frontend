import * as AT from './actionTypes'

export const showGoogleAuthenticatorSecretUrl = () => ({
  type: AT.SHOW_GOOGLE_AUTHENTICATOR_SECRET_URL
})

export const showBackupRecovery = () => ({ type: AT.SHOW_BACKUP_RECOVERY })

export const updateEmail = (email) => ({
  payload: { email },
  type: AT.UPDATE_EMAIL
})

export const verifyEmail = (code) => ({
  payload: { code },
  type: AT.VERIFY_EMAIL
})
export const verifyEmailCodeFailure = () => ({
  type: AT.VERIFY_EMAIL_CODE_FAILURE
})
export const clearEmailCodeFailure = () => ({
  type: AT.CLEAR_EMAIL_CODE_FAILURE
})

export const updateMobile = (mobile) => ({
  payload: { mobile },
  type: AT.UPDATE_MOBILE
})

export const resendMobile = (mobile) => ({
  payload: { mobile },
  type: AT.RESEND_MOBILE
})

export const verifyMobileFailure = () => ({ type: AT.VERIFY_MOBILE_FAILURE })

export const clearMobileFailure = () => ({ type: AT.CLEAR_MOBILE_FAILURE })

export const verifyMobile = (code) => ({
  payload: { code },
  type: AT.VERIFY_MOBILE
})

export const updateLanguage = (language) => ({
  payload: { language },
  type: AT.UPDATE_LANGUAGE
})

export const updateCurrency = (currency, hideAlert) => ({
  payload: { currency, hideAlert },
  type: AT.UPDATE_CURRENCY
})

export const updateAutoLogout = (autoLogout) => ({
  payload: { autoLogout },
  type: AT.UPDATE_AUTO_LOGOUT
})

export const updateLoggingLevel = (loggingLevel) => ({
  payload: { loggingLevel },
  type: AT.UPDATE_LOGGING_LEVEL
})

export const updateIpLock = (ipLock) => ({
  payload: { ipLock },
  type: AT.UPDATE_IP_LOCK
})

export const updateIpLockOn = (ipLockOn) => ({
  payload: { ipLockOn },
  type: AT.UPDATE_IP_LOCK_ON
})

export const updateBlockTorIps = (blockTorIps) => ({
  payload: { blockTorIps },
  type: AT.UPDATE_BLOCK_TOR_IPS
})

export const updateHint = (hint) => ({ payload: { hint }, type: AT.UPDATE_HINT })

export const enableTwoStepMobile = () => ({
  payload: { authType: 5 },
  type: AT.ENABLE_TWO_STEP_MOBILE
})

export const enableTwoStepGoogleAuthenticator = (code) => ({
  payload: { code },
  type: AT.ENABLE_TWO_STEP_GOOGLE_AUTHENTICATOR
})

export const enableTwoStepYubikey = (code) => ({
  payload: { code },
  type: AT.ENABLE_TWO_STEP_YUBIKEY
})

export const updateTwoStepRemember = (authTypeNeverSave) => ({
  payload: { authTypeNeverSave },
  type: AT.UPDATE_TWO_STEP_REMEMBER
})

export const addMnemonic = (phrase) => ({
  payload: { phrase },
  type: AT.ADD_MNEMONIC
})

export const newHDAccount = (label) => ({
  payload: { label },
  type: AT.NEW_HD_ACCOUNT
})

export const showBtcPrivateKey = (addr) => ({
  payload: { addr },
  type: AT.SHOW_BTC_PRIV_KEY
})

export const showEthPrivateKey = (isLegacy) => ({
  payload: { isLegacy },
  type: AT.SHOW_ETH_PRIV_KEY
})

export const showXlmPrivateKey = () => ({
  type: AT.SHOW_XLM_PRIV_KEY
})

export const addShownBtcPrivateKey = (priv) => ({
  payload: { priv },
  type: AT.ADD_SHOWN_BTC_PRIV_KEY
})

export const addShownEthPrivateKey = (priv) => ({
  payload: { priv },
  type: AT.ADD_SHOWN_ETH_PRIV_KEY
})

export const addShownEthLegacyPrivateKey = (priv) => ({
  payload: { priv },
  type: AT.ADD_SHOWN_ETH_LEGACY_PRIV_KEY
})

export const addShownXlmPrivateKey = (priv) => ({
  payload: { priv },
  type: AT.ADD_SHOWN_XLM_PRIV_KEY
})

export const clearShownBtcPrivateKey = () => ({
  type: AT.CLEAR_SHOWN_BTC_PRIV_KEY
})

export const clearShownEthPrivateKey = () => ({
  type: AT.CLEAR_SHOWN_ETH_PRIV_KEY
})

export const clearShownEthLegacyPrivateKey = () => ({
  type: AT.CLEAR_SHOWN_ETH_LEGACY_PRIV_KEY
})

export const clearShownXlmPrivateKey = () => ({
  type: AT.CLEAR_SHOWN_XLM_PRIV_KEY
})

export const generalSettingsExternalRedirect = (destination) => ({
  payload: { destination },
  type: AT.GENERAL_SETTINGS_EXTERNAL_REDIRECT
})

export const generalSettingsInternalRedirect = (destination) => ({
  payload: { destination },
  type: AT.GENERAL_SETTINGS_INTERNAL_REDIRECT
})

export const removeRecoveryPhrase = () => ({ type: AT.REMOVE_RECOVERY_PHRASE })
