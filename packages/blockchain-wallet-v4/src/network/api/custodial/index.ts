import {
  BeneficiariesType,
  BeneficiaryType,
  WithdrawalLockResponseType,
  WithdrawResponseType
} from './types'
import { WalletFiatType } from 'core/types'

export default ({ authorizedGet, authorizedPost, nabuUrl }) => {
  const getBeneficiaries = (): BeneficiariesType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/payments/beneficiaries'
    })

  const getWithdrawalLocks = (): WithdrawalLockResponseType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/payments/withdrawals/locks'
    })

  const withdrawFunds = (
    beneficiary: BeneficiaryType,
    currency: WalletFiatType,
    baseAmount: string
  ): WithdrawResponseType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/payments/withdrawals',
      contentType: 'application/json',
      headers: {
        'blockchain-origin': 'simplebuy'
      },
      data: {
        beneficiary: beneficiary.id,
        currency,
        amount: baseAmount
      }
    })

  return {
    getBeneficiaries,
    getWithdrawalLocks,
    withdrawFunds
  }
}
