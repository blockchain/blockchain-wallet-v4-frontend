export default ({ post, rootUrl }) => {
  const getSettings = (guid, sharedKey) =>
    post({
      data: { format: 'json', guid, method: 'get-info', sharedKey },
      endPoint: '/wallet',
      url: rootUrl
    })

  const updateSettings = (guid, sharedKey, method, payload, querystring = '') =>
    post({
      data: { guid, length: `${payload}`.length, method, payload, sharedKey },
      endPoint: querystring ? `/wallet?${querystring}` : '/wallet',
      url: rootUrl
    })

  const updateEmail = (guid, sharedKey, email) =>
    updateSettings(guid, sharedKey, 'update-email', email)

  const sendConfirmationCodeEmail = (guid, sharedKey, email) =>
    updateSettings(guid, sharedKey, 'send-verify-email-mail', email)

  const sendEmailConfirmation = (guid, sharedKey, email) =>
    updateSettings(guid, sharedKey, 'update-email', email)

  const resendVerifyEmail = (guid, sharedKey, email) =>
    updateSettings(guid, sharedKey, 'resend-verify-email', email)

  const verifyEmail = (guid, sharedKey, code) =>
    updateSettings(guid, sharedKey, 'verify-email-code', code)

  const updateMobile = (guid, sharedKey, mobile) =>
    updateSettings(guid, sharedKey, 'update-sms', mobile)

  const verifyMobile = (guid, sharedKey, code) =>
    updateSettings(guid, sharedKey, 'verify-sms', code)

  const updateLanguage = (guid, sharedKey, language) =>
    updateSettings(guid, sharedKey, 'update-language', language)

  const updateCurrency = (guid, sharedKey, currency) =>
    updateSettings(guid, sharedKey, 'update-currency', currency)

  const updateLastTxTime = (guid, sharedKey, time) =>
    updateSettings(guid, sharedKey, 'update-last-tx-time', time)

  const updateLoggingLevel = (guid, sharedKey, loggingLevel) =>
    updateSettings(guid, sharedKey, 'update-logging-level', loggingLevel)

  const updateIpLock = (guid, sharedKey, ipLock) =>
    updateSettings(guid, sharedKey, 'update-ip-lock', ipLock)

  const updateIpLockOn = (guid, sharedKey, ipLockOn) =>
    updateSettings(guid, sharedKey, 'update-ip-lock-on', ipLockOn)

  const updateBlockTorIps = (guid, sharedKey, blockTorIps) =>
    updateSettings(guid, sharedKey, 'update-block-tor-ips', blockTorIps)

  const updateHint = (guid, sharedKey, hint) =>
    updateSettings(guid, sharedKey, 'update-password-hint1', hint)

  const updateAuthType = (guid, sharedKey, authType) =>
    updateSettings(guid, sharedKey, 'update-auth-type', authType)

  const updateAuthTypeNeverSave = (guid, sharedKey, authTypeNeverSave) =>
    updateSettings(guid, sharedKey, 'update-never-save-auth-type', authTypeNeverSave)

  const getGoogleAuthenticatorSecretUrl = (guid, sharedKey) =>
    updateSettings(guid, sharedKey, 'generate-google-secret', '')

  const enableGoogleAuthenticator = (guid, sharedKey, code) =>
    updateSettings(guid, sharedKey, 'update-auth-type', '4', `code=${code}`)

  const enableYubikey = (guid, sharedKey, code) =>
    updateSettings(guid, sharedKey, 'update-yubikey', code)

  const enableNotifications = (guid, sharedKey, value) =>
    updateSettings(guid, sharedKey, 'update-notifications-on', value)

  const updateNotificationsType = (guid, sharedKey, value) =>
    updateSettings(guid, sharedKey, 'update-notifications-type', value)

  return {
    enableGoogleAuthenticator,
    enableNotifications,
    enableYubikey,
    getGoogleAuthenticatorSecretUrl,
    getSettings,
    resendVerifyEmail,
    sendConfirmationCodeEmail,
    sendEmailConfirmation,
    updateAuthType,
    updateAuthTypeNeverSave,
    updateBlockTorIps,
    updateCurrency,
    updateEmail,
    updateHint,
    updateIpLock,
    updateIpLockOn,
    updateLanguage,
    updateLastTxTime,
    updateLoggingLevel,
    updateMobile,
    updateNotificationsType,
    verifyEmail,
    verifyMobile
  }
}
