
import { merge } from 'ramda'

export default ({ rootUrl, apiUrl, get, post }) => {
  const fetchPayloadWithSharedKey = (guid, sharedKey) => post({
    url: rootUrl,
    endPoint: '/wallet',
    data: { guid, sharedKey, method: 'wallet.aes.json', format: 'json' }
  })

  const fetchPayloadWithSession = (guid, sessionToken) => get({
    url: rootUrl,
    endPoint: `/wallet/${guid}`,
    data: { format: 'json', resend_code: null },
    sessionToken
  })

  const fetchPayloadWithTwoFactorAuth = (guid, sessionToken, twoFactorCode) => post({
    url: rootUrl,
    endPoint: '/wallet',
    data: {
      guid,
      payload: twoFactorCode,
      length: twoFactorCode.length,
      method: 'get-wallet',
      format: 'plain'
    },
    sessionToken
  })

  const savePayload = data => post({
    url: rootUrl,
    endPoint: '/wallet',
    data: merge({ method: 'update', format: 'plain' }, data)
  }).then(() => data.checksum)

  const createPayload = (email, data) => post({
    url: rootUrl,
    endPoint: '/wallet',
    data: merge({ method: 'insert', format: 'plain', email }, data)
  }).then(() => data.checksum)

  const fetchBlockchainData = (context, { n = 50, offset = 0, onlyShow } = {}) => {
    const data = {
      active: (Array.isArray(context) ? context : [context]).join('|'),
      format: 'json',
      offset: offset,
      no_compact: true,
      ct: new Date().getTime(),
      n: n,
      language: 'en',
      no_buttons: true
    }
    return post({
      url: rootUrl,
      endPoint: '/multiaddr',
      data: onlyShow ? merge(data, { onlyShow }) : data
    })
  }

  const obtainSessionToken = () => post({
    url: rootUrl,
    endPoint: '/wallet/sessions'
  }).then((data) => (!data.token || !data.token.length)
    ? Promise.reject(new Error('INVALID_SESSION_TOKEN'))
    : data.token
  )

  const pollForSessionGUID = sessionToken => get({
    url: rootUrl,
    endPoint: '/wallet/poll-for-session-guid',
    data: { format: 'json' },
    sessionToken
  })

  const generateUUIDs = (count) => get({
    url: rootUrl,
    endPoint: '/uuid-generator',
    data: { format: 'json', n: count }
  }).then((data) => (!data.uuids || data.uuids.length !== count)
    ? Promise.reject(new Error('Could not generate uuids'))
    : data.uuids
  )

  // createPinEntry :: HEXString(32Bytes) -> HEXString(32Bytes) -> String -> Promise Response
  const createPinEntry = (key, value, pin) => post({
    url: rootUrl,
    endPoint: '/pin-store',
    data: { format: 'json', method: 'put', value, pin, key }
  })

  // getPinValue :: HEXString(32Bytes) -> String -> Promise Response
  const getPinValue = (key, pin) => get({
    url: rootUrl,
    endPoint: '/pin-store',
    data: { format: 'json', method: 'get', pin, key }
  })

  const remindGuid = (email, captcha, sessionToken) => post({
    url: rootUrl,
    endPoint: '/wallet',
    data: { method: 'recover-wallet', email, captcha },
    sessionToken
  })

  const reset2fa = (guid, email, newEmail, secretPhrase, message, code, sessionToken) => post({
    url: rootUrl,
    endPoint: '/wallet',
    data: {
      method: 'reset-two-factor-form',
      guid,
      email,
      contact_email: newEmail,
      secret_phrase: secretPhrase,
      message,
      kaptcha: code
    },
    sessionToken
  })

  const getPairingPassword = (guid) => post({
    url: rootUrl,
    endPoint: '/wallet',
    data: { method: 'pairing-encryption-password', guid }
  })

  const authorizeLogin = (token, confirm) => post({
    url: rootUrl,
    endPoint: '/wallet',
    data: {
      token: token,
      confirm_approval: confirm,
      method: 'authorize-approve'
    }
  })

  const handle2faReset = (token) => post({
    url: rootUrl,
    endPoint: '/wallet',
    data: {
      token: token,
      method: 'reset-two-factor-token'
    }
  })

  const verifyEmailToken = (token) => post({
    url: rootUrl,
    endPoint: '/wallet',
    data: {
      token: token,
      method: 'verify-email-token'
    }
  })

  const incrementStat = (eventName) => get({
    url: rootUrl,
    endPoint: '/event',
    data: {name: 'wallet_web_login_via', mode: 'no-cors'}
  })

  const incrementSecPasswordStats = (secondPassActive) => get({
    url: rootUrl,
    endPoint: '/event',
    data: {name: `wallet_login_second_password_${secondPassActive ? 1 : 0}`}
  })

  const incrementLoginViaQrStats = () => get({
    url: rootUrl,
    endPoint: '/event',
    data: {name: 'wallet_login_second_password_wallet_web_login_via_qr'}
  })

  const incrementCurrencyUsageStats = (btcBalance, ethBalance, bchBalance) => get({
    url: rootUrl,
    endPoint: '/event',
    data: {name: `wallet_login_balance_btc_${btcBalance > 0 ? 1 : 0}_eth_${ethBalance > 0 ? 1 : 0}_bch_${bchBalance > 0 ? 1 : 0}`}
  })

  return {
    authorizeLogin,
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
    pollForSessionGUID,
    remindGuid,
    reset2fa,
    savePayload,
    incrementStat,
    handle2faReset,
    verifyEmailToken,
    incrementSecPasswordStats,
    incrementLoginViaQrStats,
    incrementCurrencyUsageStats
  }
}
