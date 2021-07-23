import { contains, prop, sum, toLower } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import * as pairing from '../../pairing'
import * as selectors from '../selectors'
import * as walletActions from '../wallet/actions'
import * as wS from '../wallet/selectors'
import * as actions from './actions'

const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
  const fetchSettings = function* () {
    try {
      const guid = yield select(selectors.wallet.getGuid)
      const sharedKey = yield select(selectors.wallet.getSharedKey)
      yield put(actions.fetchSettingsLoading())
      const data = yield call(api.getSettings, guid, sharedKey)
      yield put(actions.fetchSettingsSuccess(data))
    } catch (e) {
      yield put(actions.fetchSettingsFailure(e.message))
    }
  }
  // Utilities
  const decodePairingCode = function* ({ data }) {
    const { encrypted, guid } = yield call(() => taskToPromise(pairing.parseQRcode(data)))
    const passphrase = yield call(api.getPairingPassword, guid)
    const { password, sharedKey } = yield call(() =>
      taskToPromise(pairing.decode(encrypted, passphrase))
    )
    return { guid, password, sharedKey }
  }

  const requestGoogleAuthenticatorSecretUrl = function* () {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.getGoogleAuthenticatorSecretUrl, guid, sharedKey)
    if (!contains('secret', response)) {
      throw new Error(response)
    }
    yield put(actions.setGoogleAuthenticatorSecretUrl(response))
    // return response
  }

  const setEmail = function* ({ email }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateEmail, guid, sharedKey, email)
    if (!contains('updated', toLower(response))) {
      throw new Error(response)
    }
    yield put(actions.setEmail(email))
  }

  const sendConfirmationCodeEmail = function* ({ email }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.sendConfirmationCodeEmail, guid, sharedKey, email)
    if (!response.success) {
      throw new Error(response)
    }
    yield put(actions.sentConfirmationCodeSuccess(email))
  }

  const verifyEmailCode = function* ({ code }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.verifyEmail, guid, sharedKey, code)
    if (!response.success) {
      yield put(actions.setEmailVerifiedFailedStatus(true))
      throw new Error(response)
    }
    yield put(actions.setEmailVerified())
  }

  const resendVerifyEmail = function* ({ email }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.resendVerifyEmail, guid, sharedKey, email)
    if (!prop('success', response)) throw new Error(JSON.stringify(response))
  }

  const setMobile = function* ({ mobile }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateMobile, guid, sharedKey, mobile)
    yield put(actions.setMobile(mobile))
    return response
  }

  const setMobileVerified = function* ({ code }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.verifyMobile, guid, sharedKey, code)
    yield put(actions.setMobileVerified())
    return response
  }

  const setMobileVerifiedAs2FA = function* ({ code }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.verifyMobile, guid, sharedKey, code)
    if (!contains('successfully', toLower(response))) {
      throw new Error(response)
    }
    yield put(actions.setMobileVerified())
    const updateAuthCall = yield call(api.updateAuthType, guid, sharedKey, '5')
    if (!contains('updated', updateAuthCall)) {
      throw new Error(updateAuthCall)
    }
    yield put(actions.setAuthType(5))
  }

  const setLanguage = function* ({ language }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateLanguage, guid, sharedKey, language)
    if (!contains('successfully', toLower(response))) {
      throw new Error(response)
    }
    yield put(actions.setLanguage(language))
  }

  const setLastTxTime = function* () {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const d = new Date()
    const epoch = d.setHours(0, 0, 0, 0)
    try {
      yield call(api.updateLastTxTime, guid, sharedKey, epoch)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error: setLastTxTime')
    }
  }

  const setCurrency = function* ({ currency }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateCurrency, guid, sharedKey, currency)
    if (!contains('successfully', toLower(response))) {
      throw new Error(response)
    }
    yield put(actions.setCurrency(currency))
  }

  const setAutoLogout = function* ({ autoLogout }) {
    yield put(walletActions.setAutoLogout(autoLogout))
  }

  const setLoggingLevel = function* ({ loggingLevel }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateLoggingLevel, guid, sharedKey, String(loggingLevel))
    if (!contains('Logging level updated.', response)) {
      throw new Error(response)
    }
    yield put(actions.setLoggingLevel(loggingLevel))
  }

  const setIpLock = function* ({ ipLock }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateIpLock, guid, sharedKey, String(ipLock || ''))
    if (!contains('Ip Addresses Updated', response)) {
      throw new Error(response)
    }
    yield put(actions.setIpLock(ipLock))
  }

  const setIpLockOn = function* ({ ipLockOn }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateIpLockOn, guid, sharedKey, String(Boolean(ipLockOn)))
    if (!contains('Updated IP Lock Settings', response)) {
      throw new Error(response)
    }
    yield put(actions.setIpLockOn(ipLockOn))
  }

  const setBlockTorIps = function* ({ blockTorIps }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateBlockTorIps, guid, sharedKey, String(blockTorIps))
    if (!contains('Tor IP address settings updated.', response)) {
      throw new Error(response)
    }
    yield put(actions.setBlockTorIps(blockTorIps))
  }

  const setHint = function* ({ hint }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateHint, guid, sharedKey, hint)
    if (!contains('Updated Password Hint', response)) {
      throw new Error(response)
    }
    yield put(actions.setHint(hint))
  }

  const setAuthType = function* ({ authType }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.updateAuthType, guid, sharedKey, authType)
    if (!contains('updated', response)) {
      throw new Error(response)
    }
    yield put(actions.setAuthType(authType))
  }

  const setAuthTypeNeverSave = function* ({ authTypeNeverSave }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(
      api.updateAuthTypeNeverSave,
      guid,
      sharedKey,
      String(Boolean(authTypeNeverSave))
    )
    if (!contains('Success', response)) {
      throw new Error(response)
    }
    yield put(actions.setAuthTypeNeverSave(authTypeNeverSave))
  }

  const setGoogleAuthenticator = function* ({ code }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.enableGoogleAuthenticator, guid, sharedKey, code)
    if (!contains('updated', response)) {
      throw new Error(response)
    }
    yield put(actions.setGoogleAuthenticator())
  }

  const setYubikey = function* ({ code }) {
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.enableYubikey, guid, sharedKey, code)
    yield call(api.updateAuthType, guid, sharedKey, '1')
    if (!contains('updated', response)) {
      throw new Error(response)
    }
    yield put(actions.setYubikey())
  }

  const setNotificationsOn = function* ({ enabled }) {
    const value = enabled ? 2 : 0
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const response = yield call(api.enableNotifications, guid, sharedKey, value)
    if (!contains('updated', response)) {
      throw new Error(response)
    }
    yield put(actions.setNotificationsOn(value))
  }

  const setNotificationsType = function* ({ types }) {
    const typesState: number[] = []
    const emailVerified = yield select(selectors.settings.getEmailVerified)
    const smsVerified = yield select(selectors.settings.getSmsVerified)
    if (prop('email', types) && emailVerified.getOrElse(0)) {
      typesState.push(1)
    }
    if (prop('mobile', types) && smsVerified.getOrElse(0)) {
      typesState.push(32)
    }
    const guid = yield select(wS.getGuid)
    const sharedKey = yield select(wS.getSharedKey)
    const notificationsType = sum(typesState)
    const response = yield call(api.updateNotificationsType, guid, sharedKey, notificationsType)
    if (!contains('updated', response)) {
      throw new Error(response)
    }
    yield put(walletActions.setSyncPubKeys(notificationsType > 0))
    yield put(actions.setNotificationsType(typesState))
  }

  return {
    decodePairingCode,
    fetchSettings,
    requestGoogleAuthenticatorSecretUrl,
    resendVerifyEmail,
    sendConfirmationCodeEmail,
    setAuthType,
    setAuthTypeNeverSave,
    setAutoLogout,
    setBlockTorIps,
    setCurrency,
    setEmail,
    setGoogleAuthenticator,
    setHint,
    setIpLock,
    setIpLockOn,
    setLanguage,
    setLastTxTime,
    setLoggingLevel,
    setMobile,
    setMobileVerified,
    setMobileVerifiedAs2FA,
    setNotificationsOn,
    setNotificationsType,
    setYubikey,
    verifyEmailCode
  }
}
