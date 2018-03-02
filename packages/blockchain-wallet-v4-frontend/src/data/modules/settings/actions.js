import * as AT from './actionTypes'

export const showGoogleAuthenticatorSecretUrl = () => ({ type: AT.SHOW_GOOGLE_AUTHENTICATOR_SECRET_URL })

export const showBackupRecovery = () => ({ type: AT.SHOW_BACKUP_RECOVERY })

export const updateEmail = (email) => ({ type: AT.UPDATE_EMAIL, payload: { email } })

export const verifyEmail = (code) => ({ type: AT.VERIFY_EMAIL, payload: { code } })

export const updateMobile = (mobile) => ({ type: AT.UPDATE_MOBILE, payload: { mobile } })

export const verifyMobile = (code) => ({ type: AT.VERIFY_MOBILE, payload: { code } })

export const updateLanguage = (language) => ({ type: AT.UPDATE_LANGUAGE, payload: { language } })

export const updateCurrency = (currency) => ({ type: AT.UPDATE_CURRENCY, payload: { currency } })

export const updateBitcoinUnit = (unit) => ({ type: AT.UPDATE_BITCOIN_UNIT, payload: { unit } })

export const updateAutoLogout = (autoLogout) => ({ type: AT.UPDATE_AUTO_LOGOUT, payload: { autoLogout } })

export const updateLoggingLevel = (loggingLevel) => ({ type: AT.UPDATE_LOGGING_LEVEL, payload: { loggingLevel } })

export const updateIpLock = (ipLock) => ({ type: AT.UPDATE_IP_LOCK, payload: { ipLock } })

export const updateIpLockOn = (ipLockOn) => ({ type: AT.UPDATE_IP_LOCK_ON, payload: { ipLockOn } })

export const updateBlockTorIps = (blockTorIps) => ({ type: AT.UPDATE_BLOCK_TOR_IPS, payload: { blockTorIps } })

export const updateHint = (hint) => ({ type: AT.UPDATE_HINT, payload: { hint } })

export const enableTwoStepMobile = () => ({ type: AT.ENABLE_TWO_STEP_MOBILE, payload: { authType: 5 } })

export const enableTwoStepGoogleAuthenticator = (code) => ({ type: AT.ENABLE_TWO_STEP_GOOGLE_AUTHENTICATOR, payload: { code } })

export const enableTwoStepYubikey = (code) => ({ type: AT.ENABLE_TWO_STEP_YUBIKEY, payload: { code } })

export const updateTwoStepRemember = (authTypeNeverSave) => ({ type: AT.UPDATE_TWO_STEP_REMEMBER, payload: { authTypeNeverSave } })

export const addMnemonic = (phrase) => ({ type: AT.ADD_MNEMONIC, payload: { phrase } })

export const newHDAccount = (label) => ({ type: AT.NEW_HD_ACCOUNT, payload: { label } })
