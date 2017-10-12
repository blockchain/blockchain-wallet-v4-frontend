import 'isomorphic-fetch'
import Promise from 'es6-promise'
import { merge, identity, gt, type, trim, toLower } from 'ramda'
import { futurizeP } from 'futurize'
import walletOptions from './wallet-options.json'
Promise.polyfill()

export const BLOCKCHAIN_INFO = 'https://blockchain.info/'
export const API_BLOCKCHAIN_INFO = 'https://api.blockchain.info/'
export const API_CODE = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'

const createApi = ({ rootUrl = BLOCKCHAIN_INFO, apiUrl = API_BLOCKCHAIN_INFO, apiCode = API_CODE } = {}, returnType) => {
  const future = returnType ? futurizeP(returnType) : identity
  const request = ({ url, method, endPoint, data, extraHeaders }) => {
    // options
    let options = {
      method,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'omit'
    }

    if (extraHeaders) {
      if (extraHeaders.sessionToken) {
        options.headers['Authorization'] = 'Bearer ' + extraHeaders.sessionToken
      }
    }
    // body
    const body = encodeFormData(apiCode ? {...data, ...{ api_code: apiCode }} : {...data})

    switch (method) {
      case 'GET':
        const urlGET = `${url}${endPoint}?${body}`
        return fetch(urlGET, options).then(checkStatus).then(extractData)
      case 'POST':
        const urlPOST = `${url}${endPoint}`
        options.body = body
        return fetch(urlPOST, options).then(checkStatus).then(extractData)
      default:
        return Promise.reject(new Error('HTTP_ACTION_NOT_SUPPORTED'))
    }
  }

  // checkStatus :: Response -> Promise Response
  const checkStatus = (r) => r.ok ? Promise.resolve(r) : r.text().then(j => Promise.reject(j))

  // extractData :: Response -> Promise (JSON | BLOB | TEXT)
  const extractData = (r) => {
    const responseOfType = (t) =>
      r.headers.get('content-type') &&
      r.headers.get('content-type').indexOf(t) > -1

    switch (true) {
      case responseOfType('application/json'):
        return r.json()
      case responseOfType('image/jpeg'):
        return r.blob()
      default:
        return r.text()
    }
  }

  // encodeFormData :: Object -> String
  const encodeFormData = (data) => {
    return data
      ? Object.keys(data)
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
        .join('&')
      : ''
  }

  // fetchPayloadWithSharedKey :: (String, String) -> Promise JSON
  const fetchPayloadWithSharedKey = (guid, sharedKey) => {
    const data = { guid, sharedKey, method: 'wallet.aes.json', format: 'json' }
    return request({ url: rootUrl, method: 'POST', endPoint: 'wallet', data: data })
  }

  // fetchPayloadWithSession :: (String) -> Promise JSON
  const fetchPayloadWithSession = (guid, sessionToken) => {
    const extraHeaders = { sessionToken }
    const data = { format: 'json', resend_code: null }
    return request({ url: rootUrl, method: 'GET', endPoint: `wallet/${guid}`, data, extraHeaders })
    // const data = { guid, method: 'wallet.aes.json', format: 'json' }
    // return request({ url: rootUrl, method: 'POST', endPoint: 'wallet', data: data, extraHeaders })
  }

  const fetchPayloadWithTwoFactorAuth = (guid, sessionToken, twoFactorCode) => {
    const extraHeaders = { sessionToken }
    const data = {
      guid,
      payload: twoFactorCode,
      length: twoFactorCode.length,
      method: 'get-wallet',
      format: 'plain'
    }
    return request({ url: rootUrl, method: 'POST', endPoint: 'wallet', data, extraHeaders })
  }

  // savePayload :: (data) -> Promise JSON
  const savePayload = (data) => {
    const config = { method: 'update', format: 'plain' }
    return request({ url: rootUrl, method: 'POST', endPoint: 'wallet', data: merge(config, data) })
      .then(() => data.checksum)
  }
  // createPayload :: (data) -> Promise JSON
  // TODO :: merge save and createPayload (endPoint must be a parameter)
  const createPayload = (data) => {
    const config = { method: 'insert', format: 'plain' }
    return request({ url: rootUrl, method: 'POST', endPoint: 'wallet', data: merge(config, data) })
      .then(() => data.checksum)
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
    return request({ url: rootUrl, method: 'POST', endPoint: 'multiaddr', data })
  }

  // TODO :: obtain and establish might be done better and one function alone
  const obtainSessionToken = () => {
    var processResult = function (data) {
      if (!data.token || !data.token.length) {
        return Promise.reject(new Error('INVALID_SESSION_TOKEN'))
      }
      return data.token
    }
    return request({ url: rootUrl, method: 'POST', endPoint: 'wallet/sessions' }).then(processResult)
  }

  const establishSession = token => {
    if (token) {
      return Promise.resolve(token)
    } else {
      return obtainSessionToken()
    }
  }

  const pollForSessioGUID = sessionToken => {
    var data = { format: 'json' }
    var extraHeaders = { sessionToken }
    return request({ url: rootUrl, method: 'GET', endPoint: 'wallet/poll-for-session-guid', data, extraHeaders })
  }

  const generateUUIDs = (count) => {
    var data = { format: 'json', n: count }
    var extractUUIDs = function (data) {
      if (!data.uuids || data.uuids.length !== count) {
        return Promise.reject(new Error('Could not generate uuids'))
      }
      return data.uuids
    }
    return request({ url: rootUrl, method: 'GET', endPoint: 'uuid-generator', data }).then(extractUUIDs)
  }

  // createPinEntry :: HEXString(32Bytes) -> HEXString(32Bytes) -> String -> Promise Response
  const createPinEntry = (key, value, pin) => {
    const data = { format: 'json', method: 'put', value, pin, key }
    return request({ url: rootUrl, method: 'POST', endPoint: 'pin-store', data })
  }

  // getPinValue :: HEXString(32Bytes) -> String -> Promise Response
  const getPinValue = (key, pin) => {
    const data = { format: 'json', method: 'get', pin, key }
    return request({ url: rootUrl, method: 'GET', endPoint: 'pin-store', data })
  }

  // getTicker :: -> Promise Response
  const getTicker = () => {
    const data = { format: 'json' }
    return request({ url: rootUrl, method: 'GET', endPoint: 'ticker', data })
  }

  const getEthTicker = () => {
    const data = { format: 'json', currency: 'USD', base: 'ETH' }
    return request({ url: rootUrl, method: 'GET', endPoint: 'ticker', data })
  }

  const getSettings = (guid, sharedKey) => {
    const data = { format: 'json', method: 'get-info', guid, sharedKey }
    return request({ url: rootUrl, method: 'POST', endPoint: 'wallet', data })
  }

  const getCaptchaImage = (timestamp, sessionToken) => {
    const data = { timestamp }
    const extraHeaders = { sessionToken }
    return request({ url: rootUrl, method: 'GET', endPoint: 'kaptcha.jpg', data, extraHeaders })
  }

  const remindGuid = (email, captcha, sessionToken) => {
    const data = { method: 'recover-wallet', email, captcha }
    const extraHeaders = { sessionToken }
    return request({ url: rootUrl, method: 'POST', endPoint: 'wallet', data, extraHeaders })
  }

  const reset2fa = (guid, email, newEmail, secretPhrase, message, code, sessionToken) => {
    const data = { method: 'reset-two-factor-form', guid, email, contact_email: newEmail, secret_phrase: secretPhrase, message, kaptcha: code }
    const extraHeaders = { sessionToken }
    return request({ url: rootUrl, method: 'POST', endPoint: 'wallet', data, extraHeaders })
  }

  const getPairingPassword = (guid) => {
    const data = { method: 'pairing-encryption-password', guid }
    return request({ url: rootUrl, method: 'POST', endPoint: 'wallet', data })
  }

  const getUnspents = function (fromAddresses, confirmations = 0) {
    const data = {
      active: fromAddresses.join('|'),
      confirmations: gt(confirmations, -1) ? confirmations : -1,
      format: 'json'
    }
    return request({ url: rootUrl, method: 'POST', endPoint: 'unspent', data })
  }

  const getFee = function () {
    return request({ url: apiUrl, method: 'GET', endPoint: 'mempool/fees' })
  }

  const pushTx = function (txHex) {
    const data = { tx: txHex, format: 'plain' }
    const responseTXHASH = function (responseText) {
      if (responseText.indexOf('Transaction Submitted') > -1) {
        return true
      } else {
        return responseText
      }
    }
    return request({ url: rootUrl, method: 'POST', endPoint: 'pushtx', data })
           .then(responseTXHASH)
  }

  const getAdverts = function (number) {
    const data = { wallet: true, n: number }
    return request({ url: apiUrl, method: 'GET', endPoint: 'bci-ads/get', data: data })
  }

  const getLogs = function (guid, sharedKey) {
    const data = { guid, sharedKey, method: 'list-logs', format: 'json' }
    return request({ url: rootUrl, method: 'POST', endPoint: 'wallet', data: data })
  }

  const getPriceIndexSeries = function (coin, currency, start, scale) {
    const data = { base: toLower(coin), quote: toLower(currency), start: start, scale: scale }
    return request({ url: apiUrl, method: 'GET', endPoint: 'price/index-series', data: data })
  }

  // SETTINGS
  const updateSettings = function (guid, sharedKey, method, value, querystring = '') {
    const payload = type(value) === 'String' ? trim(value) : value + ''

    const data = {
      method,
      guid,
      sharedKey,
      length: payload.length,
      payload: payload
    }
    return request({ url: rootUrl, method: 'POST', endPoint: 'wallet' + querystring, data })
  }

  const updateEmail = (guid, sharedKey, email) => updateSettings(guid, sharedKey, 'update-email', email)

  const sendEmailConfirmation = (guid, sharedKey, email) => updateSettings(guid, sharedKey, 'update-email', email)

  const verifyEmail = (guid, sharedKey, code) => updateSettings(guid, sharedKey, 'verify-email-code', code)

  const updateMobile = (guid, sharedKey, mobile) => updateSettings(guid, sharedKey, 'update-sms', mobile)

  const verifyMobile = (guid, sharedKey, code) => updateSettings(guid, sharedKey, 'verify-sms', code)

  const updateLanguage = (guid, sharedKey, language) => updateSettings(guid, sharedKey, 'update-language', language)

  const updateCurrency = (guid, sharedKey, currency) => updateSettings(guid, sharedKey, 'update-currency', currency)

  const updateBitcoinUnit = (guid, sharedKey, unit) => updateSettings(guid, sharedKey, 'update-btc-currency', unit)

  const updateAutoLogout = (guid, sharedKey, autoLogout) => updateSettings(guid, sharedKey, 'update-auto-logout', autoLogout)

  const updateLoggingLevel = (guid, sharedKey, loggingLevel) => updateSettings(guid, sharedKey, 'update-logging-level', loggingLevel)

  const updateIpLock = (guid, sharedKey, ipLock) => updateSettings(guid, sharedKey, 'update-ip-lock', ipLock)

  const updateIpLockOn = (guid, sharedKey, ipLockOn) => updateSettings(guid, sharedKey, 'update-ip-lock-on', ipLockOn)

  const updateBlockTorIps = (guid, sharedKey, blockTorIps) => updateSettings(guid, sharedKey, 'update-block-tor-ips', blockTorIps)

  const updateHint = (guid, sharedKey, hint) => updateSettings(guid, sharedKey, 'update-password-hint1', hint)

  // 0: 2FA Disabled
  // 1: 2FA Yubikey
  // 2: 2FA Email
  // 3: ????
  // 4: 2FA Google Authenticator
  // 5: 2FA SMS
  const updateAuthType = (guid, sharedKey, authType) => updateSettings(guid, sharedKey, 'update-auth-type', authType)

  const updateAuthTypeNeverSave = (guid, sharedKey, authTypeNeverSave) => updateSettings(guid, sharedKey, 'update-never-save-auth-type', authTypeNeverSave)

  const getGoogleAuthenticatorSecretUrl = (guid, sharedKey) => updateSettings(guid, sharedKey, 'generate-google-secret')

  const enableGoogleAuthenticator = (guid, sharedKey, code) => updateSettings(guid, sharedKey, 'update-auth-type', 4, `?code=${code}`)

  const enableYubikey = (guid, sharedKey, code) => updateSettings(guid, sharedKey, 'update-yubikey', code)

  const getWalletOptions = () => (walletOptions)

  return {
    fetchPayloadWithSharedKey: future(fetchPayloadWithSharedKey),
    fetchPayloadWithTwoFactorAuth: future(fetchPayloadWithTwoFactorAuth),
    savePayload: future(savePayload),
    createPayload: future(createPayload),
    fetchBlockchainData: future(fetchBlockchainData),
    obtainSessionToken: future(obtainSessionToken),
    establishSession: future(establishSession),
    pollForSessioGUID: future(pollForSessioGUID),
    fetchWalletWithSession: future(fetchPayloadWithSession),
    generateUUIDs: future(generateUUIDs),
    createPinEntry: future(createPinEntry),
    getPinValue: future(getPinValue),
    getTicker: future(getTicker),
    getEthTicker: future(getEthTicker),
    getSettings: future(getSettings),
    getCaptchaImage: future(getCaptchaImage),
    reset2fa: future(reset2fa),
    remindGuid: future(remindGuid),
    getUnspents: future(getUnspents),
    getFee: future(getFee),
    pushTx: future(pushTx),
    getAdverts: future(getAdverts),
    getLogs: future(getLogs),
    getPriceIndexSeries: future(getPriceIndexSeries),
    getPairingPassword: future(getPairingPassword),
    updateEmail: future(updateEmail),
    sendEmailConfirmation: future(sendEmailConfirmation),
    verifyEmail: future(verifyEmail),
    updateMobile: future(updateMobile),
    verifyMobile: future(verifyMobile),
    updateLanguage: future(updateLanguage),
    updateCurrency: future(updateCurrency),
    updateBitcoinUnit: future(updateBitcoinUnit),
    updateAutoLogout: future(updateAutoLogout),
    updateLoggingLevel: future(updateLoggingLevel),
    updateIpLock: future(updateIpLock),
    updateIpLockOn: future(updateIpLockOn),
    updateBlockTorIps: future(updateBlockTorIps),
    updateHint: future(updateHint),
    updateAuthType: future(updateAuthType),
    updateAuthTypeNeverSave: future(updateAuthTypeNeverSave),
    getGoogleAuthenticatorSecretUrl: future(getGoogleAuthenticatorSecretUrl),
    enableGoogleAuthenticator: future(enableGoogleAuthenticator),
    enableYubikey: future(enableYubikey),
    getWalletOptions: future(getWalletOptions)
  }
}

export default createApi
