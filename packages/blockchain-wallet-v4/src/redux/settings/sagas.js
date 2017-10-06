import { call, put, select } from 'redux-saga/effects'
import { contains, toLower, compose, prop } from 'ramda'
import * as actions from './actions'
import * as walletActions from '../wallet/actions'
import * as pairing from '../../pairing'
import { Wallet, Wrapper } from '../../types'

export const settingsSaga = ({ api, walletPath } = {}) => {
  const requestPairingCode = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const password = yield select(compose(Wrapper.selectPassword, prop(walletPath)))
    const pairingPassword = yield call(api.getPairingPassword, guid)
    return pairing.encode(guid, sharedKey, password, pairingPassword)
  }

  const requestGoogleAuthenticatorSecretUrl = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const response = yield call(api.getGoogleAuthenticatorSecretUrl, guid, sharedKey)
    if (!contains('secret', response)) { throw new Error(response) }
    return response
  }

  // SETTERS
  const fetchSettings = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const response = yield call(api.getSettings, guid, sharedKey)
    yield put(actions.fetchSettings(response))
  }

  const setEmail = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { email } = action.payload
    const response = yield call(api.updateEmail, guid, sharedKey, email)
    if (!contains('updated', toLower(response))) { throw new Error(response) }
    yield put(actions.setEmail(email))
  }

  const setMobile = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { mobile } = action.payload
    const response = yield call(api.updateMobile, guid, sharedKey, mobile)
    if (!contains('successfully', toLower(response))) { throw new Error(response) }
    yield put(actions.setMobile(mobile))
  }

  const setMobileVerified = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { code } = action.payload
    const response = yield call(api.verifyMobile, guid, sharedKey, code)
    if (!contains('successfully', toLower(response))) { throw new Error(response) }
    yield put(actions.setMobileVerified())
  }

  const setLanguage = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { language } = action.payload
    const response = yield call(api.updateLanguage, guid, sharedKey, language)
    if (!contains('successfully', toLower(response))) { throw new Error(response) }
    yield put(actions.setLanguage(language))
  }

  const setCurrency = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { currency } = action.payload
    const response = yield call(api.updateCurrency, guid, sharedKey, currency)
    if (!contains('successfully', toLower(response))) { throw new Error(response) }
    yield put(actions.setCurrency(currency))
  }

  const setBitcoinUnit = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { unit } = action.payload
    const response = yield call(api.updateBitcoinUnit, guid, sharedKey, unit)
    if (!contains('successfully', toLower(response))) { throw new Error(response) }
    yield put(actions.setBitcoinUnit(unit))
  }

  const setAutoLogout = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { autoLogout } = action.payload
    yield call(api.updateAutoLogout, guid, sharedKey, autoLogout)
    yield put(walletActions.setAutoLogout(autoLogout))
  }

  const setLoggingLevel = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { loggingLevel } = action.payload
    const response = yield call(api.updateLoggingLevel, guid, sharedKey, loggingLevel)
    if (!contains('Logging level updated.', response)) { throw new Error(response) }
    yield put(actions.setAutoLogout(loggingLevel))
  }

  const setIpLock = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { ipLock } = action.payload
    const response = yield call(api.updateIpLock, guid, sharedKey, ipLock)
    if (!contains('Ip Addresses Updated', response)) { throw new Error(response) }
    yield put(actions.setIpLock(ipLock))
  }

  const setIpLockOn = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { ipLockOn } = action.payload
    const response = yield call(api.updateIpLockOn, guid, sharedKey, ipLockOn)
    if (!contains('Updated IP Lock Settings', response)) { throw new Error(response) }
    yield put(actions.setIpLockOn(ipLockOn))
  }

  const setBlockTorIps = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { blockTorIps } = action.payload
    const response = yield call(api.updateBlockTorIps, guid, sharedKey, blockTorIps)
    if (contains('Tor IP address settings updated.', response)) { throw new Error(response) }
    yield put(actions.setIpLockOn(blockTorIps))
  }

  const setHint = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { hint } = action.payload
    const response = yield call(api.updateHint, guid, sharedKey, hint)
    if (!contains('Updated Password Hint', response)) { throw new Error(response) }
    yield put(actions.setHint(hint))
  }

  const setAuthType = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { authType } = action.payload
    const response = yield call(api.updateAuthType, guid, sharedKey, authType)
    if (!contains('updated', response)) { throw new Error(response) }
    yield put(actions.setAuthType(authType))
  }

  const setAuthTypeNeverSave = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { authTypeNeverSave } = action.payload
    const response = yield call(api.updateAuthTypeNeverSave, guid, sharedKey, authTypeNeverSave)
    if (!contains('Success', response)) { throw new Error(response) }
    yield put(actions.setAuthTypeNeverSave(authTypeNeverSave))
  }

  const setGoogleAuthenticator = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { code } = action.payload
    const response = yield call(api.enableGoogleAuthenticator, guid, sharedKey, code)
    if (!contains('updated', response)) { throw new Error(response) }
    yield put(actions.setGoogleAuthenticator())
  }

  const setYubikey = function * (action) {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const sharedKey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const { code } = action.payload
    const response = yield call(api.enableYubikey, guid, sharedKey, code)
    yield call(api.updateAuthType, guid, sharedKey, 1)
    if (!contains('updated', response)) { throw new Error(response) }
    yield put(actions.setYubikey())
  }

  return {
    requestPairingCode,
    requestGoogleAuthenticatorSecretUrl,
    fetchSettings,
    setEmail,
    setMobile,
    setMobileVerified,
    setLanguage,
    setCurrency,
    setBitcoinUnit,
    setAutoLogout,
    setLoggingLevel,
    setIpLock,
    setIpLockOn,
    setBlockTorIps,
    setHint,
    setAuthType,
    setAuthTypeNeverSave,
    setGoogleAuthenticator,
    setYubikey
  }
}
