import {
  BeneficiariesType,
  BeneficiaryType,
  CustodialTxResponseType,
  NabuCustodialProductType,
  PaymentDepositPendingResponseType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse,
  WithdrawResponseType
} from './types'
import { CoinType, WalletFiatType } from 'core/types'

export default ({ authorizedGet, authorizedPost, nabuUrl }) => {
  const getBeneficiaries = (): BeneficiariesType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/payments/beneficiaries'
    })

  const getCustodialTxs = (
    product: NabuCustodialProductType,
    next?: string | null,
    limit?: string
  ): CustodialTxResponseType =>
    next
      ? authorizedGet({
          url: nabuUrl,
          endPoint: next,
          ignoreQueryParams: true
        })
      : authorizedGet({
          url: nabuUrl,
          endPoint: '/payments/transactions',
          data: {
            limit,
            pending: true,
            product: product
          }
        })

  const getWithdrawalLocks = (): WithdrawalLockResponseType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/payments/withdrawals/locks'
    })

  const notifyNonCustodialToCustodialTransfer = (
    currency: CoinType,
    depositAddress: string,
    txHash: string,
    amount: string,
    product: NabuCustodialProductType
  ): PaymentDepositPendingResponseType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/payments/deposits/pending',
      contentType: 'application/json',
      data: {
        currency,
        depositAddress,
        txHash,
        amount,
        product
      }
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

  const getWithdrawalFees = (
    product: NabuCustodialProductType
  ): WithdrawalMinsAndFeesResponse =>
    authorizedGet({
      url: nabuUrl,
      ignoreQueryParams: true,
      endPoint: `/payments/withdrawals/fees?product=${product}`
    })

  return {
    getBeneficiaries,
    getCustodialTxs,
    getWithdrawalLocks,
    getWithdrawalFees,
    notifyNonCustodialToCustodialTransfer,
    withdrawFunds
  }
}
