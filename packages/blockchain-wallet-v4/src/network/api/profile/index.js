export default ({
  rootUrl,
  nabuUrl,
  get,
  post,
  put,
  authorizedPut,
  authorizedGet
}) => {
  const checkUserExistence = retailToken =>
    post({
      url: nabuUrl,
      endPoint: `/users/check`,
      contentType: 'application/json',
      data: { jwt: retailToken }
    })

  const generateRetailToken = (guid, sharedKey) =>
    get({
      url: rootUrl,
      endPoint: '/wallet/signed-retail-token',
      data: {
        guid,
        sharedKey
      }
    })

  const createUser = retailToken => {
    return post({
      url: nabuUrl,
      endPoint: '/users',
      contentType: 'application/json',
      data: {
        jwt: retailToken
      }
    })
  }

  const registerUserCampaign = (
    token,
    campaignName,
    campaignData,
    newUser = false
  ) =>
    put({
      url: nabuUrl,
      endPoint: '/users/register-campaign',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CAMPAIGN': campaignName
      },
      data: {
        data: {
          ...campaignData
        },
        newUser
      }
    })

  const recoverUser = (userId, lifetimeToken, retailToken) =>
    post({
      url: nabuUrl,
      endPoint: `/users/recover/${userId}`,
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${lifetimeToken}`
      },
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

  const syncUserWithWallet = retailToken =>
    authorizedPut({
      url: nabuUrl,
      endPoint: '/users/current/walletInfo',
      contentType: 'application/json',
      data: { jwt: retailToken }
    })

  return {
    checkUserExistence,
    createUser,
    generateRetailToken,
    generateSession,
    getUser,
    recoverUser,
    registerUserCampaign,
    syncUserWithWallet,
    updateUser,
    updateUserAddress
  }
}
