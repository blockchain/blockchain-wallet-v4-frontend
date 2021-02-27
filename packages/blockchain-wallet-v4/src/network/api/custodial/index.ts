import {
  BankTransferAccountType,
  CoinType,
  SBPaymentTypes,
  WalletFiatType
} from 'core/types'

import {
  BeneficiariesType,
  BeneficiaryType,
  CustodialTransferRequestType,
  NabuCustodialProductType,
  PaymentDepositPendingResponseType,
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
    beneficiary: BeneficiaryType | BankTransferAccountType,
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
    product: WithdrawalFeesProductType,
    paymentMethod?: SBPaymentTypes | 'ALL'
  ): WithdrawalMinsAndFeesResponse =>
    authorizedGet({
      url: nabuUrl,
      data: {
        paymentMethod,
        product
      },
      endPoint: `/payments/withdrawals/fees`
    })

  const checkWithdrawalLocks = (
    paymentMethod: SBPaymentTypes,
    currency: WalletFiatType
  ): WithdrawalLockCheckResponseType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/payments/withdrawals/locks/check',
      contentType: 'application/json',
      data: {
        paymentMethod,
        currency
      }
    })

  const initiateCustodialTransfer = (request: CustodialTransferRequestType) =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/custodial/transfer',
      contentType: 'application/json',
      data: request
    })

  return {
    checkWithdrawalLocks,
    getBeneficiaries,
    getWithdrawalLocks,
    getWithdrawalFees,
    initiateCustodialTransfer,
    notifyNonCustodialToCustodialTransfer,
    withdrawFunds
  }
}
