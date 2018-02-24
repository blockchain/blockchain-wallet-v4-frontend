import { call, put, select } from 'redux-saga/effects'
import { contains, toLower } from 'ramda'
import * as actions from './actions'
import * as walletActions from '../wallet/actions'
import * as wS from '../wallet/selectors'
import * as pairing from '../../pairing'

export const settingsSaga = ({ api } = {}) => {
  // Utilities
  const decodePairingCode = function * ({ data }) {
    const parsedDataE = pairing.parseQRcode(data)
    if (parsedDataE.isRight) {
      const { guid, encrypted } = parsedDataE.value
      const passphrase = yield call(api.getPairingPassword, guid)
      const credentialsE = pairing.decode(encrypted, passphrase)
      if (credentialsE.isRight) {
        const { sharedKey, password } = credentialsE.value
        return { guid, sharedKey, password }
      } else { throw new Error(credentialsE.value) }
    } else { throw new Error(parsedDataE.value) }
  }

  const requestGoogleAuthenticatorSecretUrl = function * () {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.getGoogleAuthenticatorSecretUrl, guid, sharedKey)
    if (!contains('secret', response)) { throw new Error(response) }
    yield put(actions.setGoogleAuthenticatorSecretUrl(response))
    // return response
  }

  // SETTERS
  // const fetchSettings = function * () {
  //   const guid = yield select(wS.getGuid)
  //   const sharedKey = yield select(wS.getSharedKey)
  //   const response = yield call(api.getSettings, guid, sharedKey)
  //   yield put(actions.setSettings(response))
  // }

  const setEmail = function * ({ email }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateEmail, guid, sharedKey, email)
    if (!contains('updated', toLower(response))) { throw new Error(response) }
    yield put(actions.setEmail(email))
  }

  const sendConfirmationCodeEmail = function * ({ email }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.sendConfirmationCodeEmail, guid, sharedKey, email)
    if (!response.success) { throw new Error(response) }
    yield put(actions.sentConfirmationCodeSuccess(email))
  }

  const verifyEmailCode = function * ({ code }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.verifyEmail, guid, sharedKey, code)
    if (!response.success) {
      yield put(actions.setEmailVerifiedFailed())
      throw new Error(response)
    }
    yield put(actions.setEmailVerified())
  }

  const setMobile = function * ({ mobile }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateMobile, guid, sharedKey, mobile)
    if (!contains('successfully', toLower(response))) { throw new Error(response) }
    yield put(actions.setMobile(mobile))
  }

  const setMobileVerified = function * ({ code }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.verifyMobile, guid, sharedKey, code)
    if (!contains('successfully', toLower(response))) { throw new Error(response) }
    yield put(actions.setMobileVerified())
  }

  const setLanguage = function * ({ language }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateLanguage, guid, sharedKey, language)
    if (!contains('successfully', toLower(response))) { throw new Error(response) }
    yield put(actions.setLanguage(language))
  }

  const setCurrency = function * ({ currency }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateCurrency, guid, sharedKey, currency)
    if (!contains('successfully', toLower(response))) { throw new Error(response) }
    yield put(actions.setCurrency(currency))
  }

  const setBitcoinUnit = function * ({ unit }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateBitcoinUnit, guid, sharedKey, unit)
    if (!contains('successfully', toLower(response))) { throw new Error(response) }
    yield put(actions.setBitcoinUnit(unit))
  }

  const setAutoLogout = function * ({ autoLogout }) {
    yield put(walletActions.setAutoLogout(autoLogout))
  }

  const setLoggingLevel = function * ({ loggingLevel }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateLoggingLevel, guid, sharedKey, String(loggingLevel))
    if (!contains('Logging level updated.', response)) { throw new Error(response) }
    yield put(actions.setLoggingLevel(loggingLevel))
  }

  const setIpLock = function * ({ ipLock }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateIpLock, guid, sharedKey, String(ipLock))
    if (!contains('Ip Addresses Updated', response)) { throw new Error(response) }
    yield put(actions.setIpLock(ipLock))
  }

  const setIpLockOn = function * ({ ipLockOn }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateIpLockOn, guid, sharedKey, String(ipLockOn))
    if (!contains('Updated IP Lock Settings', response)) { throw new Error(response) }
    yield put(actions.setIpLockOn(ipLockOn))
  }

  const setBlockTorIps = function * ({ blockTorIps }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateBlockTorIps, guid, sharedKey, String(blockTorIps))
    if (!contains('Tor IP address settings updated.', response)) { throw new Error(response) }
    yield put(actions.setBlockTorIps(blockTorIps))
  }

  const setHint = function * ({ hint }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateHint, guid, sharedKey, hint)
    if (!contains('Updated Password Hint', response)) { throw new Error(response) }
    yield put(actions.setHint(hint))
  }

  const setAuthType = function * ({ authType }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateAuthType, guid, sharedKey, authType)
    if (!contains('updated', response)) { throw new Error(response) }
    yield put(actions.setAuthType(authType))
  }

  const setAuthTypeNeverSave = function * ({ authTypeNeverSave }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateAuthTypeNeverSave, guid, sharedKey, authTypeNeverSave)
    if (!contains('Success', response)) { throw new Error(response) }
    yield put(actions.setAuthTypeNeverSave(authTypeNeverSave))
  }

  const setGoogleAuthenticator = function * ({ code }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.enableGoogleAuthenticator, guid, sharedKey, code)
    if (!contains('updated', response)) { throw new Error(response) }
    yield put(actions.setGoogleAuthenticator())
  }

  const setYubikey = function * ({ code }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.enableYubikey, guid, sharedKey, code)
    yield call(api.updateAuthType, guid, sharedKey, '1')
    if (!contains('updated', response)) { throw new Error(response) }
    yield put(actions.setYubikey())
  }

  return {
    decodePairingCode,
    requestGoogleAuthenticatorSecretUrl,
    // fetchSettings,
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
    setYubikey,
    sendConfirmationCodeEmail,
    verifyEmailCode
  }
}
