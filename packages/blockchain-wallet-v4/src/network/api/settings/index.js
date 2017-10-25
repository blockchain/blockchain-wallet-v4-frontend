export default ({ rootUrl, apiUrl, get, post }) => {
  const getSettings = (guid, sharedKey) => post({
    url: rootUrl,
    endPoint: 'wallet',
    data: { guid, sharedKey, method: 'get-info' }
  })

  const updateSettings = (guid, sharedKey, method, payload, querystring = '') => post({
    url: rootUrl,
    endPoint: querystring ? `wallet?${querystring}` : 'wallet',
    data: { guid, sharedKey, method: 'update-email', payload, length: payload.length }
  })

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

  const updateAuthType = (guid, sharedKey, authType) => updateSettings(guid, sharedKey, 'update-auth-type', authType)

  const updateAuthTypeNeverSave = (guid, sharedKey, authTypeNeverSave) => updateSettings(guid, sharedKey, 'update-never-save-auth-type', authTypeNeverSave)

  const getGoogleAuthenticatorSecretUrl = (guid, sharedKey) => updateSettings(guid, sharedKey, 'generate-google-secret')

  const enableGoogleAuthenticator = (guid, sharedKey, code) => updateSettings(guid, sharedKey, 'update-auth-type', 4, `?code=${code}`)

  const enableYubikey = (guid, sharedKey, code) => updateSettings(guid, sharedKey, 'update-yubikey', code)

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
