import 'isomorphic-fetch'
import Promise from 'es6-promise'
import { merge, identity, gt } from 'ramda'
import { futurizeP } from 'futurize'
Promise.polyfill()

export const BLOCKCHAIN_INFO = 'https://blockchain.info/'
export const API_BLOCKCHAIN_INFO = 'https://api.blockchain.info/'
export const API_CODE = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'

const createApi = ({
  rootUrl = BLOCKCHAIN_INFO,
  apiUrl = API_BLOCKCHAIN_INFO,
  apiCode = API_CODE
} = {}, returnType) => {
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

  const getSettings = (guid, sharedKey) => {
    const data = { format: 'json', method: 'get-info', guid, sharedKey }
    return request({ url: rootUrl, method: 'POST', endPoint: 'wallet', data })
  }

  const getCaptchaImage = (timestamp) => {
    const data = { timestamp }
    return request({ url: rootUrl, method: 'GET', endPoint: 'kaptcha.jpg', data })
  }

  const recoverWallet = (email, captcha) => {
    const timestamp = new Date().getTime()
    const data = { method: 'recover-wallet', email, captcha, ct: timestamp }
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

  const getFee = function (fromAddresses, confirmations = 0) {
    return request({ url: apiUrl, method: 'GET', endPoint: 'mempool/fees' })
  }

  const pushTx = function (txHex) {
    const data = {
      tx: txHex,
      format: 'plain'
    }
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

  return {
    fetchPayloadWithSharedKey: future(fetchPayloadWithSharedKey),
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
    getSettings: future(getSettings),
    getCaptchaImage: future(getCaptchaImage),
    recoverWallet: future(recoverWallet),
    getUnspents: future(getUnspents),
    getFee: future(getFee),
    pushTx: future(pushTx)
  }
}

export default createApi
