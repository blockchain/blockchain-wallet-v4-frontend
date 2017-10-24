import 'isomorphic-fetch'
import { merge } from 'ramda'
import queryString from 'query-string'

export const BLOCKCHAIN_INFO = 'https://blockchain.info/'
export const API_BLOCKCHAIN_INFO = 'https://api.blockchain.info/'
export const API_CODE = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'

export default ({ rootUrl, apiUrl, apiCode }) => {
  const get = function (url, endPoint, data, sessionToken) {
    const formEncodedData = queryString.stringify({
      ...data,
      api_code: apiCode
    })

    const headers = sessionToken
      ? { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': sessionToken }
      : { 'Content-Type': 'application/x-www-form-urlencoded' }

    const options = {
      method: 'GET',
      headers,
      credentials: 'omit'
    }

    return fetch(`${url}wallet/${endPoint}?${formEncodedData}`, options)
  }

  const post = function (url, endPoint, data, sessionToken) {
    const formEncodedData = queryString.stringify({
      ...data,
      api_code: apiCode
    })

    const headers = sessionToken
      ? { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': sessionToken }
      : { 'Content-Type': 'application/x-www-form-urlencoded' }

    const options = {
      method: 'GET',
      headers,
      credentials: 'omit',
      body: formEncodedData
    }

    return fetch(`${rootUrl}wallet/${endPoint}`, options)
  }
  // fetchPayloadWithSharedKey :: (String, String) -> Promise JSON
  const fetchPayloadWithSharedKey = (guid, sharedKey) => {
    const data = { guid, sharedKey, method: 'wallet.aes.json', format: 'json' }
    return post(rootUrl, 'wallet', data)
  }

  // fetchPayloadWithSession :: (String) -> Promise JSON
  const fetchPayloadWithSession = (guid, sessionToken) => {
    const data = { format: 'json', resend_code: null }
    return get(rootUrl, `wallet/${guid}`, data, sessionToken)
  }

  const fetchPayloadWithTwoFactorAuth = (guid, sessionToken, twoFactorCode) => {
    const data = {
      guid,
      payload: twoFactorCode,
      length: twoFactorCode.length,
      method: 'get-wallet',
      format: 'plain'
    }
    return post(rootUrl, 'wallet', data, sessionToken)
  }

  // savePayload :: (data) -> Promise JSON
  const savePayload = (data) => {
    const config = { method: 'update', format: 'plain' }
    return post(rootUrl, 'wallet', merge(config, data)).then(() => data.checksum)
  }
  // createPayload :: (data) -> Promise JSON
  // TODO :: merge save and createPayload (endPoint must be a parameter)
  const createPayload = (data) => {
    const config = { method: 'insert', format: 'plain' }
    return post(rootUrl, 'wallet', merge(config, data)).then(() => data.checksum)
  }

  const fetchBlockchainData = (context, { n = 50, offset = 0, onlyShow = '' } = {}) => {
    context = Array.isArray(context) ? context : [context]
    const clientTime = (new Date()).getTime()
    const data = {
      active: context.join('|'),
      onlyShow: onlyShow,
      format: 'json',
      offset: offset,
      no_compact: true,
      ct: clientTime,
      n: n,
      language: 'en',
      no_buttons: true
    }
    return post(rootUrl, 'multiaddr', data)
  }

  // TODO :: obtain and establish might be done better and one function alone
  const obtainSessionToken = () => {
    // var processResult = function (data) {
    //   if (!data.token || !data.token.length) {
    //     return Promise.reject(new Error('INVALID_SESSION_TOKEN'))
    //   }
    //   return data.token
    // }
    return post(rootUrl, 'wallet/sessions')
  }

  const pollForSessionGUID = sessionToken => get(rootUrl, 'wallet/poll-for-session-guid', { format: 'json' }, sessionToken)

  const generateUUIDs = (count) => {
    var data = { format: 'json', n: count }
    // var extractUUIDs = function (data) {
    //   if (!data.uuids || data.uuids.length !== count) {
    //     return Promise.reject(new Error('Could not generate uuids'))
    //   }
    //   return data.uuids
    // }
    return get(rootUrl, 'uuid-generator', data).then(extractUUIDs)
  }

  // createPinEntry :: HEXString(32Bytes) -> HEXString(32Bytes) -> String -> Promise Response
  const createPinEntry = (key, value, pin) => {
    const data = { format: 'json', method: 'put', value, pin, key }
    return post(rootUrl, 'pin-store', data)
  }

  // getPinValue :: HEXString(32Bytes) -> String -> Promise Response
  const getPinValue = (key, pin) => {
    const data = { format: 'json', method: 'get', pin, key }
    return get(rootUrl, 'pin-store', data)
  }

  const remindGuid = (email, captcha, sessionToken) => {
    const data = { method: 'recover-wallet', email, captcha }
    return post(rootUrl, 'wallet', data, sessionToken)
  }

  const reset2fa = (guid, email, newEmail, secretPhrase, message, code, sessionToken) => {
    const data = { method: 'reset-two-factor-form', guid, email, contact_email: newEmail, secret_phrase: secretPhrase, message, kaptcha: code }
    return post(rootUrl, 'wallet', data, sessionToken)
  }

  const getPairingPassword = (guid) => post(rootUrl, 'wallet', { method: 'pairing-encryption-password', guid })

  return {
    createPayload,
    createPinEntry,
    fetchBlockchainData,
    fetchPayloadWithSession,
    fetchPayloadWithSharedKey,
    fetchPayloadWithTwoFactorAuth,
    generateUUIDs,
    getPairingPassword,
    getPinValue,
    obtainSessionToken,
    pollForSessioGUID: pollForSessionGUID,
    remindGuid,
    reset2fa,
    savePayload
  }
}
