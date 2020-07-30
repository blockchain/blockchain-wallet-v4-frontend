import { BeneficiariesType } from './types'

export default ({ authorizedGet, nabuUrl }) => {
  const getBeneficiaries = (): BeneficiariesType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/payments/beneficiaries'
    })

  return {
    getBeneficiaries
  }
}
