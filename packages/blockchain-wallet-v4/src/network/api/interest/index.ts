import { InterestEligibleType, InterestLimitsType } from './types'

export default ({ nabuUrl, authorizedGet }) => {
  const getInterestEligible = (): { interestEligible: InterestEligibleType } =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/eligible'
    })

  const getInterestLimits = (): { limits: InterestLimitsType } =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/limits'
    })

  return {
    getInterestEligible,
    getInterestLimits
  }
}
