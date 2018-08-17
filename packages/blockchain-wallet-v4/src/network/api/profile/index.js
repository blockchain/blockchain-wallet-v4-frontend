export default ({ nabuUrl, post, authorizedPut, authorizedGet }) => {
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

  const getUser = () =>
    authorizedGet({
      url: nabuUrl,
      contentType: 'application/json',
      endPoint: '/users/current'
    })

  const updateUser = userData =>
    authorizedPut({
      url: nabuUrl,
      contentType: 'application/json',
      endPoint: '/users/current',
      data: { ...userData }
    })

  const updateUserAddress = address =>
    authorizedPut({
      url: nabuUrl,
      contentType: 'application/json',
      endPoint: '/users/current/address',
      data: { address }
    })

  const updateUserMobile = (mobile, mobileVerified) =>
    authorizedPut({
      url: nabuUrl,
      contentType: 'application/json',
      endPoint: '/users/current/mobile',
      data: { mobile, mobileVerified }
    })

  return {
    generateUserId,
    generateLifetimeToken,
    generateSession,
    getUser,
    updateUser,
    updateUserAddress,
    updateUserMobile
  }
}
