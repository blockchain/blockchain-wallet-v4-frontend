export default ({ authorizedGet, authorizedPost, authorizedPut, get, nabuUrl, post, rootUrl }) => {
  const generateRetailToken = (guid, sharedKey) =>
    get({
      data: {
        guid,
        sharedKey
      },
      endPoint: '/wallet/signed-retail-token',
      url: rootUrl
    })

  const getLocation = () =>
    get({
      contentType: 'application/json',
      endPoint: '/geolocation',
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const createUser = (retailToken) => {
    return post({
      contentType: 'application/json',
      data: {
        jwt: retailToken
      },
      endPoint: '/users',
      url: nabuUrl
    })
  }

  const linkAccount = (linkId, email, address) => {
    return authorizedPut({
      contentType: 'application/json',
      data: {
        address,
        email,
        kycMerge: true,
        linkId
      },
      endPoint: '/users/link-account/existing',
      url: nabuUrl
    })
  }

  const finaliseLinking = () => {
    return authorizedPut({
      contentType: 'application/json',
      endPoint: '/users/link-account/finalise',
      url: nabuUrl
    })
  }

  const createLinkAccountId = () => {
    return authorizedPut({
      contentType: 'application/json',
      endPoint: '/users/link-account/create/start',
      url: nabuUrl
    })
  }

  const getPaymentsAccountExchange = (currency) => {
    return authorizedPut({
      contentType: 'application/json',
      data: {
        currency
      },
      endPoint: '/payments/accounts/linked',
      url: nabuUrl
    })
  }

  const getUserCampaigns = () => {
    return authorizedGet({
      contentType: 'application/json',
      endPoint: '/users/user-campaigns',
      url: nabuUrl
    })
  }

  const shareWalletDepositAddresses = (addresses) => {
    return authorizedPost({
      contentType: 'application/json',
      data: {
        addresses
      },
      endPoint: '/users/deposit/addresses',
      url: nabuUrl
    })
  }

  const registerUserCampaign = (campaignName, campaignData, newUser = false) =>
    authorizedPut({
      contentType: 'application/json',
      data: {
        data: {
          ...campaignData
        },
        newUser
      },
      endPoint: '/users/register-campaign',
      headers: {
        'X-CAMPAIGN': campaignName
      },
      url: nabuUrl
    })

  const recoverUser = (userId, lifetimeToken, retailToken) =>
    post({
      contentType: 'application/json',
      data: { jwt: retailToken },
      endPoint: `/users/recover/${userId}`,
      headers: {
        Authorization: `Bearer ${lifetimeToken}`
      },
      url: nabuUrl
    })

  const resetUserAccount = (userId, recoveryToken, retailToken) =>
    post({
      contentType: 'application/json',
      data: { jwt: retailToken, recoveryToken },
      endPoint: `/users/recovery/${userId}`,
      url: nabuUrl
    })

  const resetUserKyc = (userId, lifetimeToken, retailToken) =>
    post({
      contentType: 'application/json',
      data: { jwt: retailToken },
      endPoint: `/users/reset/${userId}`,
      headers: {
        Authorization: `Bearer ${lifetimeToken}`
      },
      url: nabuUrl
    })
  const generateSession = (userId, lifetimeToken, email, walletGuid) =>
    post({
      contentType: 'application/json',
      endPoint: `/auth?userId=${userId}`,
      headers: {
        Authorization: `Bearer ${lifetimeToken}`,
        'X-CLIENT-TYPE': 'WEB',
        'X-DEVICE-ID': null,
        'X-WALLET-EMAIL': email,
        'X-WALLET-GUID': walletGuid,
        'x-app-version': '6.11.1'
      },
      url: nabuUrl
    })

  const getUser = () =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: '/users/current',
      url: nabuUrl
    })

  const updateUser = (userData) =>
    authorizedPut({
      contentType: 'application/json',
      data: { ...userData },
      endPoint: '/users/current',
      url: nabuUrl
    })

  const setUserInitialAddress = (country: string, state?: string) =>
    authorizedPut({
      contentType: 'application/json',
      data: { country, state },
      endPoint: '/users/current/address/initial',
      url: nabuUrl
    })

  const updateUserAddress = (address) =>
    authorizedPut({
      contentType: 'application/json',
      data: { address },
      endPoint: '/users/current/address',
      url: nabuUrl
    })

  const syncUserWithWallet = (retailToken) =>
    authorizedPut({
      contentType: 'application/json',
      data: { jwt: retailToken },
      endPoint: '/users/current/walletInfo',
      url: nabuUrl
    })

  return {
    createLinkAccountId,
    createUser,
    finaliseLinking,
    generateRetailToken,
    generateSession,
    getLocation,
    getPaymentsAccountExchange,
    getUser,
    getUserCampaigns,
    linkAccount,
    recoverUser,
    registerUserCampaign,
    resetUserAccount,
    resetUserKyc,
    setUserInitialAddress,
    shareWalletDepositAddresses,
    syncUserWithWallet,
    updateUser,
    updateUserAddress
  }
}
