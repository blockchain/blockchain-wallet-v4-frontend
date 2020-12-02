import { CoinType, FiatType, SBPaymentTypes, WalletFiatType } from 'core/types'

import {
  BeneficiariesType,
  BeneficiaryType,
  CustodialTransferRequestType,
  NabuCustodialProductType,
  PaymentDepositPendingResponseType,
  PaymentMethod,
  ProductEligibleResponse,
  WithdrawalFeesProductType,
  WithdrawalLockCheckResponseType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse,
  WithdrawResponseType
} from './types'

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
    product: WithdrawalFeesProductType
  ): WithdrawalMinsAndFeesResponse =>
    authorizedGet({
      url: nabuUrl,
      ignoreQueryParams: true,
      endPoint: `/payments/withdrawals/fees?product=${product}`
    })

  const checkWithdrawalLocks = (
    paymentMethod: SBPaymentTypes
  ): WithdrawalLockCheckResponseType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/payments/withdrawals/locks/check',
      contentType: 'application/json',
      data: {
        paymentMethod
      }
    })

  const initiateCustodialTransfer = (request: CustodialTransferRequestType) =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/custodial/transfer',
      contentType: 'application/json',
      data: request
    })

  const fetchIsProductEligible = (
    product: NabuCustodialProductType,
    currency: FiatType
  ): ProductEligibleResponse =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/eligible/product/${product}${
        currency ? `?currency=${currency}` : ''
      }`
    })

  const fetchEligiblePaymentMethods = (
    eligibleOnly: string,
    currency: string,
    tier: string
  ): PaymentMethod[] => {
    const queryObj = {
      eligibleOnly,
      currency,
      tier
    }
    const parameters = new URLSearchParams(queryObj).toString()

    return authorizedGet({
      url: nabuUrl,
      endPoint: `/eligible/payment-methods${parameters ? `?${parameters}` : ''}`
    })
  }

  return {
    checkWithdrawalLocks,
    fetchIsProductEligible,
    fetchEligiblePaymentMethods,
    getBeneficiaries,
    getWithdrawalLocks,
    getWithdrawalFees,
    initiateCustodialTransfer,
    notifyNonCustodialToCustodialTransfer,
    withdrawFunds
  }
}
