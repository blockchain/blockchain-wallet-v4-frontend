import 'isomorphic-fetch'
import Promise from 'es6-promise'
import { merge, identity } from 'ramda'
import { futurizeP } from 'futurize'
// Promise.polyfill()

export const BLOCKCHAIN_INFO = 'https://blockchain.info/'
export const API_BLOCKCHAIN_INFO = 'https://api.blockchain.info/'
export const API_CODE = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'

const createApi = ({
  rootUrl = BLOCKCHAIN_INFO,
  apiUrl = API_BLOCKCHAIN_INFO,
  apiCode = API_CODE
} = {}, returnType) => {
  const future = returnType ? futurizeP(returnType) : identity
  const request = (action, method, data, extraHeaders) => {
    // options
    let options = {
      method: action,
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
    switch (action) {
      case 'GET':
        const urlGET = `${rootUrl}${method}?${body}`
        return fetch(urlGET, options).then(checkStatus).then(extractData)
      case 'POST':
        const urlPOST = `${rootUrl}${method}`
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

  // fetchWalletWithSharedKey :: (String, String) -> Promise JSON
  const fetchWalletWithSharedKey = (guid, sharedKey) => {
    var data = { guid, sharedKey, method: 'wallet.aes.json', format: 'json' }
    return request('POST', 'wallet', data)
  }

  // fetchWallet :: (String) -> Promise JSON
  const fetchWalletWithSession = (guid, sessionToken) => {
    var headers = { sessionToken }
    var data = { format: 'json', resend_code: null }
    return request('GET', 'wallet/' + guid, data, headers)
  }
  // saveWallet :: (data) -> Promise JSON
  const saveWallet = (data) => {
    const config = { method: 'update', format: 'plain' }
    return request('POST', 'wallet', merge(config, data))
      .then(() => data.checksum)
  }
  // createWallet :: (data) -> Promise JSON
  // TODO :: merge save and createWallet (method must be a parameter)
  const createWallet = (data) => {
    const config = { method: 'insert', format: 'plain' }
    return request('POST', 'wallet', merge(config, data))
      .then(() => data.checksum)
  }

  const fetchBlockchainData = (context, { n = 50, offset = 0 } = {}) => {
    context = Array.isArray(context) ? context : [context]
    let url = `${rootUrl}multiaddr?active=${context.join('|')}&cors=true&n=${n}&offset=${offset}`
    return fetch(url).then(res => res.json())
  }

  // TODO :: obtain and establish might be done better and one function alone
  const obtainSessionToken = () => {
    var processResult = function (data) {
      if (!data.token || !data.token.length) {
        return Promise.reject(new Error('INVALID_SESSION_TOKEN'))
      }
      return data.token
    }
    return request('POST', 'wallet/sessions').then(processResult)
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
    var headers = { sessionToken }
    return request('GET', 'wallet/poll-for-session-guid', data, headers)
  }

  const generateUUIDs = (count) => {
    var data = { format: 'json', n: count }
    var extractUUIDs = function (data) {
      if (!data.uuids || data.uuids.length !== count) {
        return Promise.reject(new Error('Could not generate uuids'))
      }
      return data.uuids
    }
    return request('GET', 'uuid-generator', data).then(extractUUIDs)
  }

  // createPinEntry :: HEXString(32Bytes) -> HEXString(32Bytes) -> String -> Promise Response
  const createPinEntry = (key, value, pin) => {
    const data = { format: 'json', method: 'put', value, pin, key }
    return request('POST', 'pin-store', data)
  }

  // getPinValue :: HEXString(32Bytes) -> String -> Promise Response
  const getPinValue = (key, pin) => {
    const data = { format: 'json', method: 'get', pin, key }
    return request('GET', 'pin-store', data)
  }

  return {
    fetchWalletWithSharedKey: future(fetchWalletWithSharedKey),
    saveWallet: future(saveWallet),
    createWallet: future(createWallet),
    fetchBlockchainData: future(fetchBlockchainData),
    obtainSessionToken: future(obtainSessionToken),
    establishSession: future(establishSession),
    pollForSessioGUID: future(pollForSessioGUID),
    fetchWalletWithSession: future(fetchWalletWithSession),
    generateUUIDs: future(generateUUIDs),
    createPinEntry: future(createPinEntry),
    getPinValue: future(getPinValue)
  }
}

export default createApi
