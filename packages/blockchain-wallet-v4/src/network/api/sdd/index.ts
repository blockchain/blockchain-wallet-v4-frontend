import { FiatType } from '../../../types'
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
      endPoint: `/sdd/eligible`,
      contentType: 'application/json',
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
