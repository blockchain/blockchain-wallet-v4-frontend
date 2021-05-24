import { concat, mergeRight, prop, propOr } from 'ramda'

export default ({ get, post, rootUrl }) => {
  const fetchPayloadWithSharedKey = (guid, sharedKey) =>
    post({
      data: { format: 'json', guid, method: 'wallet.aes.json', sharedKey },
      endPoint: '/wallet',
      url: rootUrl
    })

  const fetchPayloadWithSession = (guid, sessionToken) =>
    get({
      data: { format: 'json', resend_code: null },
      endPoint: `/wallet/${guid}`,
      sessionToken,
      url: rootUrl
    })

  const fetchPayloadWithTwoFactorAuth = (guid, sessionToken, twoFactorCode) => {
    return post({
      data: {
        format: 'plain',
        guid,
        length: twoFactorCode.length,
        method: 'get-wallet',
        payload: twoFactorCode
      },
      endPoint: '/wallet',
      sessionToken,
      url: rootUrl
    })
  }

  const savePayload = (data) =>
    post({
      data: mergeRight({ format: 'plain', method: 'update' }, data),
      endPoint: '/wallet',
      url: rootUrl
    }).then(() => data.checksum)

  const createPayload = (email, data) =>
    post({
      data: mergeRight({ email, format: 'plain', method: 'insert' }, data),
      endPoint: '/wallet',
      url: rootUrl
    }).then(() => data.checksum)

  // context => {
  //  addresses: [],
  //  legacy: [],
  //  bech32: []
  // }
  // onlyShow is xpub or address to filter data with
  const fetchBlockchainData = (
    context,
    { n = 50, offset = 0, onlyShow = false } = {},
    filter?: Number
  ) => {
    const addresses = prop('addresses', context)
    const addressArray = Array.isArray(addresses) ? addresses : [addresses]
    // both addresses and legacy xpubs
    const active = concat(addressArray, propOr([], 'legacy', context)).join('|')
    // bech32 xpubs only
    // @ts-ignore
    const activeBech32 = propOr([], 'bech32', context).join('|')
    const data = {
      active,
      activeBech32,
      ct: new Date().getTime(),
      filter,
      format: 'json',
      language: 'en',
      n,
      no_buttons: true,
      no_compact: true,
      offset
    }
    return post({
      data: onlyShow
        ? mergeRight(data, {
            onlyShow: (Array.isArray(onlyShow) ? onlyShow : [onlyShow]).join('|')
          })
        : data,
      endPoint: '/multiaddr',
      url: rootUrl
    })
  }

  const obtainSessionToken = () =>
    post({
      endPoint: '/wallet/sessions',
      url: rootUrl
    }).then((data) =>
      !data.token || !data.token.length
        ? Promise.reject(new Error('INVALID_SESSION_TOKEN'))
        : data.token
    )

  const pollForSessionGUID = (sessionToken) =>
    get({
      data: { format: 'json' },
      endPoint: '/wallet/poll-for-session-guid',
      sessionToken,
      url: rootUrl
    })

  const generateUUIDs = (count) =>
    get({
      data: { format: 'json', n: count },
      endPoint: '/uuid-generator',
      url: rootUrl
    }).then((data) =>
      !data.uuids || data.uuids.length !== count
        ? Promise.reject(new Error('Could not generate uuids'))
        : data.uuids
    )

  // createPinEntry :: HEXString(32Bytes) -> HEXString(32Bytes) -> String -> Promise Response
  const createPinEntry = (key, value, pin) =>
    post({
      data: { format: 'json', key, method: 'put', pin, value },
      endPoint: '/pin-store',
      url: rootUrl
    })

  // getPinValue :: HEXString(32Bytes) -> String -> Promise Response
  const getPinValue = (key, pin) =>
    get({
      data: { format: 'json', key, method: 'get', pin },
      endPoint: '/pin-store',
      url: rootUrl
    })

  const resendSmsLoginCode = (guid, sessionToken) =>
    get({
      data: { format: 'json', resend_code: true },
      endPoint: `/wallet/${guid}`,
      sessionToken,
      url: rootUrl
    })

  const remindGuid = (email, captchaToken, sessionToken) =>
    post({
      data: { captcha: captchaToken, email, method: 'send-guid-reminder' },
      endPoint: '/wallet',
      sessionToken,
      url: rootUrl
    })

  const deauthorizeBrowser = (sessionToken) =>
    get({
      data: { format: 'plain' },
      endPoint: '/wallet/logout',
      sessionToken,
      url: rootUrl
    })

  const reset2fa = (guid, email, newEmail, captchaToken, sessionToken) =>
    post({
      data: {
        captcha: captchaToken,
        contact_email: newEmail,
        email,
        guid,
        method: 'reset-two-factor-form'
      },
      endPoint: '/wallet',
      sessionToken,
      url: rootUrl
    })

  const getPairingPassword = (guid) =>
    post({
      data: { guid, method: 'pairing-encryption-password' },
      endPoint: '/wallet',
      url: rootUrl
    })

  const authorizeLogin = (token, confirm) =>
    post({
      data: {
        confirm_approval: confirm,
        method: 'authorize-approve',
        token
      },
      endPoint: '/wallet',
      url: rootUrl
    })

  const sendSecureChannel = (message) =>
    post({
      data: {
        length: message.length,
        method: 'send-secure-channel-browser',
        payload: message
      },
      endPoint: '/wallet',
      url: rootUrl
    })

  const handle2faReset = (token) =>
    post({
      data: {
        method: 'reset-two-factor-token',
        token
      },
      endPoint: '/wallet',
      url: rootUrl
    })

  const verifyEmailToken = (token) =>
    post({
      data: {
        method: 'verify-email-token',
        token
      },
      endPoint: '/wallet',
      url: rootUrl
    })

  return {
    authorizeLogin,
    createPayload,
    createPinEntry,
    deauthorizeBrowser,
    fetchBlockchainData,
    fetchPayloadWithSession,
    fetchPayloadWithSharedKey,
    fetchPayloadWithTwoFactorAuth,
    generateUUIDs,
    getPairingPassword,
    getPinValue,
    handle2faReset,
    obtainSessionToken,
    pollForSessionGUID,
    remindGuid,
    resendSmsLoginCode,
    reset2fa,
    savePayload,
    sendSecureChannel,
    verifyEmailToken
  }
}
