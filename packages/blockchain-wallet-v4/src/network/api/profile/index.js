export default ({
  rootUrl,
  nabuUrl,
  get,
  post,
  authorizedPut,
  authorizedGet
}) => {
  const generateRetailToken = (guid, sharedKey) =>
    get({
      url: rootUrl,
      endPoint: '/wallet/signed-retail-token',
      data: {
        guid,
        sharedKey
      }
    })

  const createUser = retailToken =>
    post({
      url: nabuUrl,
      endPoint: '/user',
      contentType: 'application/json',
      data: { jwt: retailToken }
    })

  const generateSession = (userId, lifetimeToken, email, walletGuid) =>
    post({
      url: nabuUrl,
      endPoint: `/auth?userId=${userId}`,
      contentType: 'application/json',
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
      endPoint: '/users/current',
      contentType: 'application/json',
      data: { ...userData }
    })

  const updateUserAddress = address =>
    authorizedPut({
      url: nabuUrl,
      endPoint: '/users/current/address',
      contentType: 'application/json',
      data: { address }
    })

  const syncUserWithWallet = retailToken => {
    authorizedPut({
      url: nabuUrl,
      endPoint: '/users/current/walletInfo',
      data: { jwt: retailToken }
    })
  }

  return {
    createUser,
    generateRetailToken,
    generateSession,
    getUser,
    updateUser,
    updateUserAddress,
    syncUserWithWallet
  }
}
