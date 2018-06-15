import { put, call, select } from 'redux-saga/effects'
import * as actions from '../../actions.js'
import * as selectors from '../../selectors.js'
import * as C from 'services/AlertService'
import { askSecondPasswordEnhancer, promptForSecondPassword } from 'services/SagaService'
import { Types, utils } from 'blockchain-wallet-v4/src'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ coreSagas }) => {
  const logLocation = 'modules/settings/sagas'

  const initSettingsInfo = function * () {
    try {
      yield call(coreSagas.settings.fetchSettings)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initSettingsInfo', e))
    }
  }

  const initSettingsPreferences = function * () {
    try {
      yield call(coreSagas.settings.fetchSettings)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initSettingsPreferences', e))
    }
  }

  const showBackupRecovery = function * () {
    const recoverySaga = function * ({ password }) {
      const getMnemonic = s => selectors.core.wallet.getMnemonic(s, password)
      try {
        const mnemonicT = yield select(getMnemonic)
        const mnemonic = yield call(() => taskToPromise(mnemonicT))
        const mnemonicArray = mnemonic.split(' ')
        yield put(actions.modules.settings.addMnemonic({ mnemonic: mnemonicArray }))
      } catch (e) {
        yield put(actions.logs.logErrorMessage(logLocation, 'showBackupRecovery', e))
      }
    }
    yield call(askSecondPasswordEnhancer(recoverySaga), {})
  }

  const showGoogleAuthenticatorSecretUrl = function * () {
    try {
      const googleAuthenticatorSecretUrl = yield call(coreSagas.settings.requestGoogleAuthenticatorSecretUrl)
      yield put(actions.modals.showModal('TwoStepGoogleAuthenticator', { googleAuthenticatorSecretUrl }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'showGoogleAuthenticatorSecretUrl', e))
    }
  }

  const updateMobile = function * (action) {
    try {
      yield call(coreSagas.settings.setMobile, action.payload)
      yield put(actions.alerts.displaySuccess(C.MOBILE_UPDATE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateMobile', e))
      yield put(actions.alerts.displayError(C.MOBILE_UPDATE_ERROR))
    }
  }

  const verifyMobile = function * (action) {
    try {
      yield call(coreSagas.settings.setMobileVerified, action.payload)
      yield put(actions.alerts.displaySuccess(C.MOBILE_VERIFY_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'verifyMobile', e))
      yield put(actions.alerts.displayError(C.MOBILE_VERIFY_ERROR))
      yield put(actions.modules.settings.verifyMobileFailure())
    }
  }

  // We prefer local storage language and update this in background for
  // things like emails and external communication with the user
  const updateLanguage = function * (action) {
    try {
      yield call(coreSagas.settings.setLanguage, action.payload)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateLanguage', e))
    }
  }

  const updateCurrency = function * (action) {
    try {
      yield call(coreSagas.settings.setCurrency, action.payload)
      yield put(actions.alerts.displaySuccess(C.CURRENCY_UPDATE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateCurrency', e))
      yield put(actions.alerts.displayErrorC.CURRENCY_UPDATE_ERROR)
    }
  }

  const updateAutoLogout = function * (action) {
    try {
      yield call(coreSagas.settings.setAutoLogout, action.payload)
      yield put(actions.auth.startLogoutTimer())
      yield put(actions.alerts.displaySuccess(C.AUTOLOGOUT_UPDATE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateAutoLogout', e))
      yield put(actions.alerts.displayError(C.AUTOLOGOUT_UPDATE_ERROR))
    }
  }

  const updateLoggingLevel = function * (action) {
    try {
      yield call(coreSagas.settings.setLoggingLevel, action.payload)
      yield put(actions.alerts.displaySuccess(C.LOGGINGLEVEL_UPDATE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateLoggingLevel', e))
      yield put(actions.alerts.displayError(C.LOGGINGLEVEL_UPDATE_ERROR))
    }
  }

  const updateIpLock = function * (action) {
    try {
      yield call(coreSagas.settings.setIpLock, action.payload)
      yield put(actions.alerts.displaySuccess(C.IPWHITELIST_UPDATE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateIpLock', e))
      yield put(actions.alerts.displayError(C.IPWHITELIST_UPDATE_ERROR))
    }
  }

  const updateIpLockOn = function * (action) {
    try {
      yield call(coreSagas.settings.setIpLockOn, action.payload)
      yield put(actions.alerts.displaySuccess(C.IPRESTRICTION_UPDATE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateIpLockOn', e))
      yield put(actions.alerts.displayError(C.IPRESTRICTION_UPDATE_ERROR))
    }
  }

  const updateBlockTorIps = function * (action) {
    try {
      yield call(coreSagas.settings.setBlockTorIps, action.payload)
      yield put(actions.alerts.displaySuccess(C.TOR_UPDATE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateBlockTorIps', e))
      yield put(actions.alerts.displayError(C.TOR_UPDATE_ERROR))
    }
  }

  const updateHint = function * (action) {
    try {
      yield call(coreSagas.settings.setHint, action.payload)
      yield put(actions.alerts.displaySuccess(C.HINT_UPDATE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateHint', e))
      yield put(actions.alerts.displayError(C.HINT_UPDATE_ERROR))
    }
  }

  const updateTwoStepRemember = function * (action) {
    try {
      yield call(coreSagas.settings.setAuthTypeNeverSave, action.payload)
      if (action.payload.authTypeNeverSave === 1) {
        const guid = yield select(selectors.core.wallet.getGuid)
        yield put(actions.session.removeSession(guid))
      }
      yield put(actions.alerts.displaySuccess(C.TWOFA_REMEMBER_UPDATE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateTwoStepRemember', e))
      yield put(actions.alerts.displayError(C.TWOFA_REMEMBER_UPDATE_ERROR))
    }
  }

  const enableTwoStepMobile = function * (action) {
    try {
      yield call(coreSagas.settings.setAuthType, action.payload)
      yield put(actions.alerts.displaySuccess(C.TWOFA_MOBILE_ENABLE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'enableTwoStepMobile', e))
      yield put(actions.alerts.displayError(C.TWOFA_MOBILE_ENABLE_ERROR))
    }
    yield put(actions.modals.closeModal())
  }

  const enableTwoStepGoogleAuthenticator = function * (action) {
    try {
      yield call(coreSagas.settings.setGoogleAuthenticator, action.payload)
      yield put(actions.alerts.displaySuccess(C.TWOFA_GOOGLEAUTH_ENABLE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'enableTwoStepGoogleAuthenticator', e))
      yield put(actions.alerts.displayError(C.TWOFA_GOOGLEAUTH_ENABLE_ERROR))
    }
    yield put(actions.modals.closeModal())
  }

  const enableTwoStepYubikey = function * (action) {
    try {
      yield call(coreSagas.settings.setYubikey, action.payload)
      yield put(actions.alerts.displaySuccess(C.TWOFA_YUBIKEY_ENABLE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'enableTwoStepYubikey', e))
      yield put(actions.alerts.displayError(C.TWOFA_YUBIKEY_ENABLE_ERROR))
    }
    yield put(actions.modals.closeModal())
  }

  const newHDAccount = function * (action) {
    try {
      yield call(askSecondPasswordEnhancer(coreSagas.wallet.newHDAccount), action.payload)
      yield put(actions.core.kvStore.bch.fetchMetadataBch())
      yield put(actions.alerts.displaySuccess(C.NEW_WALLET_CREATE_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'newHDAccount', e))
      yield put(actions.alerts.displayError(C.NEW_WALLET_CREATE_ERROR))
    }
    yield put(actions.modals.closeModal())
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
      yield put(actions.logs.logErrorMessage(logLocation, 'showBtcPrivateKey', e))
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
      yield put(actions.logs.logErrorMessage(logLocation, 'showEthPrivateKey', e))
    }
  }

  return {
    initSettingsInfo,
    initSettingsPreferences,
    showBackupRecovery,
    showGoogleAuthenticatorSecretUrl,
    updateMobile,
    verifyMobile,
    updateLanguage,
    updateCurrency,
    updateAutoLogout,
    updateLoggingLevel,
    updateIpLock,
    updateIpLockOn,
    updateBlockTorIps,
    updateHint,
    updateTwoStepRemember,
    enableTwoStepMobile,
    enableTwoStepGoogleAuthenticator,
    enableTwoStepYubikey,
    newHDAccount,
    showBtcPrivateKey,
    showEthPrivateKey
  }
}
