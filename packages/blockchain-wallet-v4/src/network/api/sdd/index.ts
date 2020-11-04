import { FiatType } from 'core/types'
import { SDDType, SDDUpdateType } from './types'

export default ({ nabuUrl, authorizedGet, authorizedPost }) => {
  const fetchSDDEligible = (): SDDType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/sdd/eligible`
    })

  const updateSDDEligible = (
    amount: number,
    currency: FiatType
  ): SDDUpdateType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: `/sdd/verified`,
      contentType: 'application/json',
      removeDefaultPostData: true,
      data: {
        amount,
        currency
      }
    })

  return {
    fetchSDDEligible,
    updateSDDEligible
  }
}
