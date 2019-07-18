export default ({
  rootUrl,
  nabuUrl,
  get,
  post,
  authorizedPost,
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

  const createUser = (retailToken, coinifyId) => {
    return post({
      url: nabuUrl,
      endPoint: '/users',
      contentType: 'application/json',
      data: {
        jwt: retailToken,
        metadata: {
          'coinify-trader-id': coinifyId
        }
      }
    })
  }

  const linkAccount = linkId => {
    return authorizedPut({
      url: nabuUrl,
      endPoint: '/users/link-account/existing',
      contentType: 'application/json',
      data: {
        linkId
      }
    })
  }

  const createLinkAccountId = () => {
    return authorizedPut({
      url: nabuUrl,
      endPoint: '/users/link-account/create/start',
      contentType: 'application/json'
    })
  }

  const shareWalletDepositAddresses = addresses => {
    return authorizedPost({
      url: nabuUrl,
      endPoint: '/users/deposit/addresses',
      contentType: 'application/json',
      data: {
        addresses
      }
    })
  }

  const registerUserCampaign = (campaignName, campaignData, newUser = false) =>
    authorizedPut({
      url: nabuUrl,
      endPoint: '/users/register-campaign',
      contentType: 'application/json',
      headers: {
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
        'X-DEVICE-ID': null,
        'X-CLIENT-TYPE': 'WEB',
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
    createLinkAccountId,
    generateRetailToken,
    generateSession,
    getUser,
    linkAccount,
    recoverUser,
    registerUserCampaign,
    syncUserWithWallet,
    updateUser,
    shareWalletDepositAddresses,
    updateUserAddress
  }
}
