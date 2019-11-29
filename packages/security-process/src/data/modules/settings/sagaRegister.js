import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default (...args) => {
  const settingsSagas = sagas(...args)

  return function * settingsModuleSaga () {
    yield takeLatest(AT.INIT_SETTINGS_INFO, settingsSagas.initSettingsInfo)
    yield takeLatest(
      AT.INIT_SETTINGS_PREFERENCES,
      settingsSagas.initSettingsPreferences
    )
    yield takeLatest(AT.SHOW_BACKUP_RECOVERY, settingsSagas.showBackupRecovery)
    yield takeLatest(
      AT.SHOW_GOOGLE_AUTHENTICATOR_SECRET_URL,
      settingsSagas.showGoogleAuthenticatorSecretUrl
    )
    yield takeLatest(AT.UPDATE_MOBILE, settingsSagas.updateMobile)
    yield takeLatest(AT.RESEND_MOBILE, settingsSagas.resendMobile)
    yield takeLatest(AT.VERIFY_MOBILE, settingsSagas.verifyMobile)
    yield takeLatest(AT.UPDATE_CURRENCY, settingsSagas.updateCurrency)
    yield takeLatest(AT.UPDATE_AUTO_LOGOUT, settingsSagas.updateAutoLogout)
    yield takeLatest(AT.UPDATE_LOGGING_LEVEL, settingsSagas.updateLoggingLevel)
    yield takeLatest(AT.UPDATE_IP_LOCK, settingsSagas.updateIpLock)
    yield takeLatest(AT.UPDATE_IP_LOCK_ON, settingsSagas.updateIpLockOn)
    yield takeLatest(AT.UPDATE_BLOCK_TOR_IPS, settingsSagas.updateBlockTorIps)
    yield takeLatest(AT.UPDATE_HINT, settingsSagas.updateHint)
    yield takeLatest(
      AT.UPDATE_TWO_STEP_REMEMBER,
      settingsSagas.updateTwoStepRemember
    )
    yield takeLatest(
      AT.ENABLE_TWO_STEP_MOBILE,
      settingsSagas.enableTwoStepMobile
    )
    yield takeLatest(
      AT.ENABLE_TWO_STEP_GOOGLE_AUTHENTICATOR,
      settingsSagas.enableTwoStepGoogleAuthenticator
    )
    yield takeLatest(
      AT.ENABLE_TWO_STEP_YUBIKEY,
      settingsSagas.enableTwoStepYubikey
    )
    yield takeLatest(AT.NEW_HD_ACCOUNT, settingsSagas.newHDAccount)
  }
}
