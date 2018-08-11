export default ({ nabuUrl, post, patch }) => {
  const generateUserId = (email, walletGuid) =>
    post({
      url: nabuUrl,
      contentType: 'application/json',
      data: { email, walletGuid },
      endPoint: '/users',
      headers: { Authorization: 'Basic' }
    })

  const generateLifetimeToken = (userId, email, walletGuid) =>
    post({
      url: nabuUrl,
      contentType: 'application/json',
      endPoint: `/auth?userId=${userId}`,
      useApiToken: true,
      headers: {
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
        'X-WALLET-GUID': walletGuid,
        'X-WALLET-EMAIL': email,
        Authorizarion: `Bearer ${lifetimeToken}`
      }
    })

  const createUser = (userData, sessionToken) =>
    // post({
    //   url: apiUrl,
    //   endPoint: '/users'
    //   data: { ...userData },
    //   sessionToken
    // })
    Promise.resolve({ id: '1234', state: 'CREATED', kycState: 'NONE' })

  const updateUser = (userId, userData, sessionToken) =>
    // patch({
    //   url: apiUrl,
    //   endPoint: '/users/${userId}',
    //   data: { ...userData }
    //   sessionToken
    // })
    Promise.resolve(userData)

  return {
    createUser,
    generateUserId,
    generateLifetimeToken,
    generateSession,
    updateUser
  }
}
