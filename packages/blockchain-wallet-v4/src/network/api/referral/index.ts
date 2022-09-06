export default ({ authorizedGet, authorizedPost, get, nabuUrl }) => {
  const checkIsValidReferralCode = (code: string) =>
    get({
      contentType: 'application/json',
      endPoint: `/referral/${code}`,
      url: nabuUrl
    })

  const createReferral = (referralCode: string) =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        referralCode
      },
      endPoint: '/referral',
      url: nabuUrl
    })

  const getReferralInformation = (currency: string) =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/referral/info?platform=wallet&currency=${currency}`,
      url: nabuUrl
    })

  return {
    checkIsValidReferralCode,
    createReferral,
    getReferralInformation
  }
}
