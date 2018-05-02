import { takeLatest, put, call, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as selectors from '../../selectors.js'

import { askSecondPasswordEnhancer, promptForSecondPassword } from 'services/SagaService'
import { Types, utils } from 'blockchain-wallet-v4/src'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

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
      try {
        const mnemonicT = yield select(getMnemonic)
        const mnemonic = yield call(() => taskToPromise(mnemonicT))
        const mnemonicArray = mnemonic.split(' ')
        yield put(actions.modules.settings.addMnemonic({ mnemonic: mnemonicArray }))
      } catch (e) {
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
      yield put(actions.alerts.displaySuccess('2FA remember has been successfully updated.'))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update 2FA remember.'))
    }
  }

  const enableTwoStepMobile = function * (action) {
    try {
      yield call(coreSagas.settings.setAuthType, action.payload)
      yield put(actions.alerts.displaySuccess('2FA (Mobile) has been successfully enabled.'))
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update 2FA.'))
      yield put(actions.modals.closeModal())
    }
  }

  const enableTwoStepGoogleAuthenticator = function * (action) {
    try {
      yield call(coreSagas.settings.setGoogleAuthenticator, action.payload)
      yield put(actions.alerts.displaySuccess('2FA (Google Authenticator) has been successfully enabled.'))
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update 2FA.'))
      yield put(actions.modals.closeModal())
    }
  }

  const enableTwoStepYubikey = function * (action) {
    try {
      yield call(coreSagas.settings.setYubikey, action.payload)
      yield put(actions.alerts.displaySuccess('2FA (Yubikey) has been successfully enabled.'))
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(actions.alerts.displayError('Could not update 2FA.'))
      yield put(actions.modals.closeModal())
    }
  }

  const newHDAccount = function * (action) {
    try {
      yield call(askSecondPasswordEnhancer(coreSagas.wallet.newHDAccount), action.payload)
      yield put(actions.core.kvStore.bch.addBchAccount())
      yield put(actions.alerts.displaySuccess('Successfully created new wallet.'))
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(actions.alerts.displayError(e.message || 'Could not create new wallet.'))
      yield put(actions.modals.closeModal())
    }
  }

  const showBtcPrivateKey = function * (action) {
    const { addr } = action.payload
    const password = yield call(promptForSecondPassword)
    const wallet = yield select(selectors.core.wallet.getWallet)
    try {
      const privT = Types.Wallet.getPrivateKeyForAddress(wallet, password, addr)
      const priv = yield call(() => taskToPromise(privT))
      yield put(actions.modules.settings.addShownBtcPrivateKey(priv))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not show private key for address.'))
    }
  }

  const showEthPrivateKey = function * (action) {
    const { isLegacy } = action.payload
    const password = yield call(promptForSecondPassword)
    try {
      if (isLegacy) {
        const getSeedHex = state => selectors.core.wallet.getSeedHex(state, password)
        const seedHexT = yield select(getSeedHex)
        const seedHex = yield call(() => taskToPromise(seedHexT))
        const legPriv = utils.ethereum.getLegacyPrivateKey(seedHex).toString('hex')
        yield put(actions.modules.settings.addShownEthPrivateKey(legPriv))
      } else {
        const getMnemonic = state => selectors.core.wallet.getMnemonic(state, password)
        const mnemonicT = yield select(getMnemonic)
        const mnemonic = yield call(() => taskToPromise(mnemonicT))
        let priv = utils.ethereum.getPrivateKey(mnemonic, 0).toString('hex')
        yield put(actions.modules.settings.addShownEthPrivateKey(priv))
      }
    } catch (e) {
      yield put(actions.alerts.displayError('Could not derive private key.'))
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
    yield takeLatest(AT.SHOW_BTC_PRIV_KEY, showBtcPrivateKey)
    yield takeLatest(AT.SHOW_ETH_PRIV_KEY, showEthPrivateKey)
  }
}
