import queryString from 'querystring'

export default ({ rootUrl, apiUrl, apiCode }) => {
  const post = function (guid, sharedKey, method, value, querystring = '') {
    const data = queryString.stringify({
      guid,
      sharedKey,
      method,
      api_code: apiCode,
      payload: value,
      length: value.length
    })

    const url = `${rootUrl}wallet${querystring}`

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'omit',
      body: data
    }

    return fetch(url, options)
  }

  const getSettings = (guid, sharedKey) => post(guid, sharedKey, 'get-info')

  const updateEmail = (guid, sharedKey, email) => post(guid, sharedKey, 'update-email', email)

  const sendEmailConfirmation = (guid, sharedKey, email) => post(guid, sharedKey, 'update-email', email)

  const verifyEmail = (guid, sharedKey, code) => post(guid, sharedKey, 'verify-email-code', code)

  const updateMobile = (guid, sharedKey, mobile) => post(guid, sharedKey, 'update-sms', mobile)

  const verifyMobile = (guid, sharedKey, code) => post(guid, sharedKey, 'verify-sms', code)

  const updateLanguage = (guid, sharedKey, language) => post(guid, sharedKey, 'update-language', language)

  const updateCurrency = (guid, sharedKey, currency) => post(guid, sharedKey, 'update-currency', currency)

  const updateBitcoinUnit = (guid, sharedKey, unit) => post(guid, sharedKey, 'update-btc-currency', unit)

  const updateAutoLogout = (guid, sharedKey, autoLogout) => post(guid, sharedKey, 'update-auto-logout', autoLogout)

  const updateLoggingLevel = (guid, sharedKey, loggingLevel) => post(guid, sharedKey, 'update-logging-level', loggingLevel)

  const updateIpLock = (guid, sharedKey, ipLock) => post(guid, sharedKey, 'update-ip-lock', ipLock)

  const updateIpLockOn = (guid, sharedKey, ipLockOn) => post(guid, sharedKey, 'update-ip-lock-on', ipLockOn)

  const updateBlockTorIps = (guid, sharedKey, blockTorIps) => post(guid, sharedKey, 'update-block-tor-ips', blockTorIps)

  const updateHint = (guid, sharedKey, hint) => post(guid, sharedKey, 'update-password-hint1', hint)

  const updateAuthType = (guid, sharedKey, authType) => post(guid, sharedKey, 'update-auth-type', authType)

  const updateAuthTypeNeverSave = (guid, sharedKey, authTypeNeverSave) => post(guid, sharedKey, 'update-never-save-auth-type', authTypeNeverSave)

  const getGoogleAuthenticatorSecretUrl = (guid, sharedKey) => post(guid, sharedKey, 'generate-google-secret')

  const enableGoogleAuthenticator = (guid, sharedKey, code) => post(guid, sharedKey, 'update-auth-type', 4, `?code=${code}`)

  const enableYubikey = (guid, sharedKey, code) => post(guid, sharedKey, 'update-yubikey', code)

  return {
    getSettings,
    updateEmail,
    sendEmailConfirmation,
    verifyEmail,
    updateMobile,
    verifyMobile,
    updateLanguage,
    updateCurrency,
    updateBitcoinUnit,
    updateAutoLogout,
    updateLoggingLevel,
    updateIpLock,
    updateIpLockOn,
    updateBlockTorIps,
    updateHint,
    updateAuthType,
    updateAuthTypeNeverSave,
    getGoogleAuthenticatorSecretUrl,
    enableGoogleAuthenticator,
    enableYubikey
  }
}
