import {
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType
} from './types'

export default ({ nabuUrl, authorizedGet }) => {
  const getInterestEligible = (): { interestEligible: InterestEligibleType } =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/eligible'
    })

  const getInterestInstruments = (): InterestInstrumentsType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/instruments'
    })

  const getInterestLimits = (): { limits: InterestLimitsType } =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/limits'
    })

  return {
    getInterestEligible,
    getInterestInstruments,
    getInterestLimits
  }
}
