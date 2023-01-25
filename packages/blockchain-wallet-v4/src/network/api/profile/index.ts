import {
  FindAddressResponse,
  RetrieveAddress,
  TermsAndConditionType,
  UserRiskSettings
} from './types'

export default ({
  apiUrl,
  authorizedGet,
  authorizedPost,
  authorizedPut,
  get,
  nabuUrl,
  post,
  rootUrl
}) => {
  const exchangeSignIn = (captchaToken, code, password, username) =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        code,
        password,
        recaptchaToken: captchaToken,
        siteKey: window.CAPTCHA_KEY,
        username
      },
      endPoint: '/signin',
      url: nabuUrl
    })

  const exchangeResetPassword = (email) =>
    post({
      contentType: 'application/json',
      data: {
        email
      },
      endPoint: '/password/reset/create',
      url: nabuUrl
    })

  const generateRetailToken = (guid, sharedKey) =>
    post({
      data: {
        guid,
        method: 'signed-retail-token',
        sharedKey
      },
      endPoint: '/wallet',
      url: rootUrl
    })

  const getLocation = () =>
    get({
      contentType: 'application/json',
      endPoint: '/geolocation',
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const createOrGetUser = (retailToken) =>
    post({
      contentType: 'application/json',
      data: {
        jwt: retailToken
      },
      endPoint: '/users',
      url: nabuUrl
    })

  const createExchangeUser = (countryCode, referrerUsername, retailToken, tuneTid) =>
    post({
      contentType: 'application/json',
      data: {
        countryCode,
        referrerUsername,
        retailToken,
        tuneTid
      },
      endPoint: '/mercury/users',
      url: nabuUrl
    })

  const getExchangeAuthToken = (exchangeLifetimeToken, usersCredentialsId, retailToken) =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        retailToken,
        usersCredentialsId
      },
      endPoint: '/mercury/auth',
      headers: {
        Authorization: `Bearer ${exchangeLifetimeToken}`,
        'X-CLIENT-TYPE': 'WEB',
        'X-DEVICE-ID': null,
        'x-app-version': '6.11.1'
      },
      url: nabuUrl
    })

  const linkAccount = (linkId, email, address) =>
    authorizedPut({
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

  const finaliseLinking = () =>
    authorizedPut({
      contentType: 'application/json',
      endPoint: '/users/link-account/finalise',
      url: nabuUrl
    })

  const createLinkAccountId = () =>
    authorizedPut({
      contentType: 'application/json',
      endPoint: '/users/link-account/create/start',
      url: nabuUrl
    })

  const getPaymentsAccountExchange = (currency) =>
    authorizedPut({
      contentType: 'application/json',
      data: {
        currency
      },
      endPoint: '/payments/accounts/linked',
      url: nabuUrl
    })

  const getUserCampaigns = () =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: '/users/user-campaigns',
      url: nabuUrl
    })

  const shareWalletDepositAddresses = (addresses) =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        addresses
      },
      endPoint: '/users/deposit/addresses',
      url: nabuUrl
    })

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

  const setUserCurrentCurrency = (currency) =>
    authorizedPut({
      contentType: 'application/json',
      data: { fiatTradingCurrency: currency },
      endPoint: '/users/current/currency',
      url: nabuUrl
    })

  const getUserTermsAndConditions = (): TermsAndConditionType =>
    authorizedGet({
      endPoint: '/user/terms-and-conditions',
      url: nabuUrl
    })

  const getUserTermsAndConditionsLast = (): TermsAndConditionType =>
    authorizedGet({
      endPoint: '/user/terms-and-conditions/last',
      url: nabuUrl
    })

  const signUserTermsAndConditionsLast = () =>
    authorizedPut({
      endPoint: '/user/terms-and-conditions/sign-latest',
      url: nabuUrl
    })

  // const checkIsValidReferralCode = (code: string) =>
  //   get({
  //     contentType: 'application/json',
  //     endPoint: `/referral/${code}`,
  //     url: nabuUrl
  //   })

  const getUserReferralInfo = () =>
    authorizedGet({
      endPoint: `/referral/info`,
      url: nabuUrl
    })
  // reset account endpoints

  const triggerResetAccountEmail = (captchaToken, email, sessionToken) =>
    post({
      contentType: 'application/json',
      data: {
        captcha: captchaToken,
        email,
        siteKey: window.CAPTCHA_KEY
      },
      endPoint: '/auth/request-account-recovery',
      sessionToken,
      url: apiUrl
    })

  const pollForResetApprovalStatus = (sessionToken) =>
    get({
      contentType: 'application/json',
      endPoint: `/wallet/recovery/check-recovery-token`,
      sessionToken,
      url: rootUrl
    })

  const approveAccountReset = (email, sessionToken, token, userId) =>
    post({
      contentType: 'application/json',
      data: {
        email,
        token,
        userId
      },
      endPoint: `/wallet/recovery/approve-recovery-token`,
      sessionToken,
      url: rootUrl
    })

  // const createReferral = (referralCode: string) =>
  //   authorizedPost({
  //     contentType: 'application/json',
  //     data: {
  //       referralCode
  //     },
  //     endPoint: '/referral',
  //     url: nabuUrl
  //   })

  const findUserAddress = (text: string, id?: string, countryCode?: string): FindAddressResponse =>
    authorizedGet({
      data: { country_code: countryCode, id, text },
      endPoint: '/address-capture/find',
      url: nabuUrl
    })

  const userAddressRetrieve = (id: string): RetrieveAddress =>
    authorizedGet({
      data: { id },
      endPoint: '/address-capture/retrieve',
      url: nabuUrl
    })

  const getUserRiskSettings = (): UserRiskSettings =>
    authorizedGet({
      endPoint: '/user/risk/settings',
      url: nabuUrl
    })

  const validatePersonName = (firstName: string, lastName: string) =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        firstName,
        lastName
      },
      endPoint: '/validation/person-name',
      url: nabuUrl
    })

  return {
    approveAccountReset,
    // checkIsValidReferralCode,
    createExchangeUser,
    createLinkAccountId,
    createOrGetUser,
    exchangeResetPassword,
    exchangeSignIn,
    finaliseLinking,
    findUserAddress,
    generateRetailToken,
    generateSession,
    getExchangeAuthToken,
    getLocation,
    getPaymentsAccountExchange,
    getUser,
    getUserCampaigns,
    getUserReferralInfo,
    getUserRiskSettings,
    getUserTermsAndConditions,
    getUserTermsAndConditionsLast,
    linkAccount,
    pollForResetApprovalStatus,
    recoverUser,
    registerUserCampaign,
    resetUserAccount,
    resetUserKyc,
    setUserCurrentCurrency,
    setUserInitialAddress,
    shareWalletDepositAddresses,
    signUserTermsAndConditionsLast,
    syncUserWithWallet,
    triggerResetAccountEmail,
    updateUser,
    updateUserAddress,
    userAddressRetrieve,
    validatePersonName
  }
}
