export default ({ nabuUrl, post, authorizedPut }) => {
  const generateUserId = (email, walletGuid) =>
    post({
      url: nabuUrl,
      contentType: 'application/json',
      data: { email, walletGuid },
      endPoint: '/internal/users',
      headers: { Authorization: 'Basic' }
    })

  const generateLifetimeToken = (userId, email, walletGuid) =>
    post({
      url: nabuUrl,
      contentType: 'application/json',
      endPoint: `/internal/auth?userId=${userId}`,
      headers: {
        Authorization: 'Basic',
        'X-WALLET-GUID': walletGuid,
        'X-WALLET-EMAIL': email
      }
    })

  const generateSession = (userId, lifetimeToken, email, walletGuid) =>
    post({
      url: nabuUrl,
      contentType: 'application/json',
      endPoint: `/auth?userId=${userId}`,
      headers: {
        'X-DEVICE-ID': 'deviceId',
        'x-client-type': 'WEB',
        'x-app-version': '6.11.1',
        'X-WALLET-GUID': walletGuid,
        'X-WALLET-EMAIL': email,
        Authorization: `Bearer ${lifetimeToken}`
      }
    })

  const updateUser = (userData, sessionToken) =>
    authorizedPut({
      url: nabuUrl,
      endPoint: '/users',
      data: { ...userData },
      sessionToken
    })

  return {
    generateUserId,
    generateLifetimeToken,
    generateSession,
    updateUser
  }
}
