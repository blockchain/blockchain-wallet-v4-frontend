import { takeLatest, put, call, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as selectors from '../../selectors.js'

import { askSecondPasswordEnhancer, promptForSecondPassword } from 'services/SagaService'
import { Types } from 'blockchain-wallet-v4/src'

export default ({ coreSagas }) => {
  const initSettingsInfo = function * () {
    try {
      yield call(coreSagas.settings.fetchSettings)
    } catch (e) {
      yield put(actions.alerts.displayError('Could not init settings info.'))
    }
  }

  const initSettingsPreferences = function * () {
    try {
      yield call(coreSagas.settings.fetchSettings)
    } catch (e) {
      yield put(actions.alerts.displayError('Could not init settings security.'))
    }
  }

  // const initSettingsSecurity = function * () {
  //   try {
  //     yield call(coreSagas.settings.fetchSettings)
  //   } catch (e) {
  //     yield put(actions.alerts.displayError('Could not init settings security.'))
  //   }
  // }

  const showBackupRecovery = function * (action) {
    const recoverySaga = function * ({ password }) {
      const getMnemonic = s => selectors.core.wallet.getMnemonic(s, password)
      const eitherMnemonic = yield select(getMnemonic)
      if (eitherMnemonic.isRight) {
        const mnemonic = eitherMnemonic.value.split(' ')
        yield put(actions.modules.settings.addMnemonic({ mnemonic }))
      } else {
        yield put(actions.alerts.displayError('Could not read mnemonic.'))
      }
    }
    yield call(askSecondPasswordEnhancer(recoverySaga), {})
  }

  const showGoogleAuthenticatorSecretUrl = function * (action) {
    try {
      const googleAuthenticatorSecretUrl = yield call(coreSagas.settings.requestGoogleAuthenticatorSecretUrl)
      yield put(actions.modals.showModal('TwoStepGoogleAuthenticator', { googleAuthenticatorSecretUrl }))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not fetch google authenticator secret.'))
    }
  }

  const updateMobile = function * (action) {
    try {
      yield call(coreSagas.settings.setMobile, action.payload)
      yield put(actions.alerts.displaySuccess('Mobile number has been successfully updated. Verification SMS has been sent.'))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update mobile number.'))
    }
  }

  const verifyMobile = function * (action) {
    try {
      yield call(coreSagas.settings.setMobileVerified, action.payload)
      yield put(actions.alerts.displaySuccess('Mobile number has been verified!'))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not verify mobile number.'))
      yield put(actions.modules.settings.verifyMobileFailure())
    }
  }

  const updateLanguage = function * (action) {
    try {
      yield call(coreSagas.settings.setLanguage, action.payload)
      yield put(actions.alerts.displaySuccess('Language has been successfully updated.'))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update language.'))
    }
  }

  const updateCurrency = function * (action) {
    try {
      yield call(coreSagas.settings.setCurrency, action.payload)
      yield put(actions.alerts.displaySuccess('Currency has been successfully updated.'))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update currency.'))
    }
  }

  const updateAutoLogout = function * (action) {
    try {
      yield call(coreSagas.settings.setAutoLogout, action.payload)
      yield put(actions.auth.startLogoutTimer())
      yield put(actions.alerts.displaySuccess('Auto logout has been successfully updated.'))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update auto logout.'))
    }
  }

  const updateLoggingLevel = function * (action) {
    try {
      yield call(coreSagas.settings.setLoggingLevel, action.payload)
      yield put(actions.alerts.displaySuccess('Logging level has been successfully updated.'))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update logging level.'))
    }
  }

  const updateIpLock = function * (action) {
    try {
      yield call(coreSagas.settings.setIpLock, action.payload)
      yield put(actions.alerts.displaySuccess('IP whitelist has been successfully updated.'))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update IP whitelist.'))
    }
  }

  const updateIpLockOn = function * (action) {
    try {
      yield call(coreSagas.settings.setIpLockOn, action.payload)
      yield put(actions.alerts.displaySuccess('IP restriction has been successfully updated.'))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update IP restriction.'))
    }
  }

  const updateBlockTorIps = function * (action) {
    try {
      yield call(coreSagas.settings.setBlockTorIps, action.payload)
      yield put(actions.alerts.displaySuccess('TOR blocking has been successfully updated.'))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update TOR blocking.'))
    }
  }

  const updateHint = function * (action) {
    try {
      yield call(coreSagas.settings.setHint, action.payload)
      yield put(actions.alerts.displaySuccess('Hint has been successfully updated.'))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update hint.'))
    }
  }

  const updateTwoStepRemember = function * (action) {
    try {
      yield call(coreSagas.settings.setAuthTypeNeverSave, action.payload)
      yield put(actions.alerts.displaySuccess('2-step verification remember has been successfully updated.'))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update 2-step verification remember.'))
    }
  }

  const enableTwoStepMobile = function * (action) {
    try {
      yield call(coreSagas.settings.setAuthType, action.payload)
      yield put(actions.alerts.displaySuccess('2-step verification (Mobile) has been successfully enabled.'))
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update 2-step verification.'))
      yield put(actions.modals.closeModal())
    }
  }

  const enableTwoStepGoogleAuthenticator = function * (action) {
    try {
      yield call(coreSagas.settings.setGoogleAuthenticator, action.payload)
      yield put(actions.alerts.displaySuccess('2-step verification (Google Authenticator) has been successfully enabled.'))
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update 2-step verification.'))
      yield put(actions.modals.closeModal())
    }
  }

  const enableTwoStepYubikey = function * (action) {
    try {
      yield call(coreSagas.settings.setYubikey, action.payload)
      yield put(actions.alerts.displaySuccess('2-step verification (Yubikey) has been successfully enabled.'))
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update 2-step verification.'))
      yield put(actions.modals.closeModal())
    }
  }

  const newHDAccount = function * (action) {
    try {
      yield call(askSecondPasswordEnhancer(coreSagas.wallet.newHDAccount), action.payload)
      yield put(actions.alerts.displaySuccess('Successfully created new wallet.'))
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(actions.alerts.displayError('Could not create new wallet.'))
      yield put(actions.modals.closeModal())
    }
  }

  const getPrivateKey = function * (action) {
    const { addr } = action.payload
    const password = yield call(promptForSecondPassword)
    const wallet = yield select(selectors.core.wallet.getWallet)
    const priv = Types.Wallet.getPrivateKeyForAddress(wallet, password, addr).getOrElse(null)
    return priv
  }

  const showPrivateKey = function * (action) {
    const priv = yield call(getPrivateKey, action)
    if (priv != null) {
      yield put(actions.modules.settings.addShownPrivateKey(priv))
    } else {
      yield put(actions.alerts.displayError('Could not show private key for address.'))
    }
  }

  const signMessage = function * (action) {
    const priv = yield call(getPrivateKey, action)
    if (priv != null) {
      // sign message using priv
    } else {
      yield put(actions.alerts.displayError('Could sign message: private key error.'))
    }
  }

  return function * () {
    yield takeLatest(AT.INIT_SETTINGS_INFO, initSettingsInfo)
    yield takeLatest(AT.INIT_SETTINGS_PREFERENCES, initSettingsPreferences)
    yield takeLatest(AT.SHOW_BACKUP_RECOVERY, showBackupRecovery)
    yield takeLatest(AT.SHOW_GOOGLE_AUTHENTICATOR_SECRET_URL, showGoogleAuthenticatorSecretUrl)
    yield takeLatest(AT.UPDATE_MOBILE, updateMobile)
    yield takeLatest(AT.VERIFY_MOBILE, verifyMobile)
    yield takeLatest(AT.UPDATE_LANGUAGE, updateLanguage)
    yield takeLatest(AT.UPDATE_CURRENCY, updateCurrency)
    yield takeLatest(AT.UPDATE_AUTO_LOGOUT, updateAutoLogout)
    yield takeLatest(AT.UPDATE_LOGGING_LEVEL, updateLoggingLevel)
    yield takeLatest(AT.UPDATE_IP_LOCK, updateIpLock)
    yield takeLatest(AT.UPDATE_IP_LOCK_ON, updateIpLockOn)
    yield takeLatest(AT.UPDATE_BLOCK_TOR_IPS, updateBlockTorIps)
    yield takeLatest(AT.UPDATE_HINT, updateHint)
    yield takeLatest(AT.UPDATE_TWO_STEP_REMEMBER, updateTwoStepRemember)
    yield takeLatest(AT.ENABLE_TWO_STEP_MOBILE, enableTwoStepMobile)
    yield takeLatest(AT.ENABLE_TWO_STEP_GOOGLE_AUTHENTICATOR, enableTwoStepGoogleAuthenticator)
    yield takeLatest(AT.ENABLE_TWO_STEP_YUBIKEY, enableTwoStepYubikey)
    yield takeLatest(AT.NEW_HD_ACCOUNT, newHDAccount)
    yield takeLatest(AT.SHOW_PRIV_KEY, showPrivateKey)
    yield takeLatest(AT.SIGN_MESSAGE, signMessage)
  }
}
