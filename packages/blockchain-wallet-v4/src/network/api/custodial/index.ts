import {
  BSPaymentTypes,
  CoinType,
  CrossBorderLimits,
  FiatType,
  WalletAccountType,
  WalletFiatType
} from '@core/types'
import {
  BankTransferAccountType,
  NabuProductType,
  ProductEligibilityResponse,
  WithdrawLimitsResponse
} from 'data/types'

import { BSTransactionsType } from '../buySell/types'
import {
  BeneficiariesType,
  BeneficiaryType,
  CustodialTransferRequestType,
  GetTransactionsHistoryType,
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
      endPoint: '/payments/beneficiaries',
      url: nabuUrl
    })

  const getWithdrawalLocks = (currency: FiatType): WithdrawalLockResponseType =>
    authorizedGet({
      data: {
        currency
      },
      endPoint: `/payments/withdrawals/locks`,
      url: nabuUrl
    })

  const notifyNonCustodialToCustodialTransfer = (
    currency: CoinType,
    depositAddress: string,
    txHash: string,
    amount: string,
    product: NabuCustodialProductType
  ): PaymentDepositPendingResponseType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        amount,
        currency,
        depositAddress,
        product,
        txHash
      },
      endPoint: '/payments/deposits/pending',
      url: nabuUrl
    })

  const withdrawFunds = (
    beneficiary: BeneficiaryType | BankTransferAccountType,
    currency: WalletFiatType,
    baseAmount: string
  ): WithdrawResponseType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        amount: baseAmount,
        beneficiary: beneficiary.id,
        currency
      },
      endPoint: '/payments/withdrawals',
      headers: {
        'blockchain-origin': 'simplebuy'
      },
      url: nabuUrl
    })

  const getWithdrawalFees = (
    product: WithdrawalFeesProductType,
    paymentMethod?: BSPaymentTypes | 'DEFAULT' | 'ALL'
  ): WithdrawalMinsAndFeesResponse =>
    authorizedGet({
      data: {
        paymentMethod,
        product
      },
      endPoint: `/payments/withdrawals/fees`,
      url: nabuUrl
    })

  const checkWithdrawalLocks = (
    paymentMethod: BSPaymentTypes,
    currency: WalletFiatType
  ): WithdrawalLockCheckResponseType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        currency,
        paymentMethod
      },
      endPoint: '/payments/withdrawals/locks/check',
      url: nabuUrl
    })

  const initiateCustodialTransfer = (request: CustodialTransferRequestType) =>
    authorizedPost({
      contentType: 'application/json',
      data: request,
      endPoint: '/custodial/transfer',
      url: nabuUrl
    })

  const getEligibilityForProduct = (product: NabuProductType): ProductEligibilityResponse =>
    authorizedGet({
      endPoint: `/eligible/product/${product}`,
      url: nabuUrl
    })

  const getTransactionsHistory = ({
    currency,
    fromValue,
    toValue
  }: GetTransactionsHistoryType): BSTransactionsType =>
    authorizedGet({
      data: {
        currency,
        fromValue,
        pending: true,
        product: 'SIMPLEBUY',
        toValue
      },
      endPoint: '/payments/transactions',
      url: nabuUrl
    })

  const getWithdrawalLimits = (currency?: FiatType): WithdrawLimitsResponse =>
    authorizedGet({
      data: {
        currency
      },
      endPoint: `/v2/limits/withdrawals`,
      url: nabuUrl
    })

  const getCrossBorderTransactions = (
    inputCurrency: CoinType,
    fromAccount: WalletAccountType,
    outputCurrency: CoinType,
    toAccount: WalletAccountType,
    currency?: WalletFiatType
  ): CrossBorderLimits =>
    authorizedGet({
      data: {
        currency,
        fromAccount,
        inputCurrency,
        outputCurrency,
        toAccount
      },
      endPoint: `/limits/crossborder/transaction`,
      url: nabuUrl
    })

  const getLimitsAndFeaturesDetails = () =>
    authorizedGet({
      endPoint: `/limits/overview`,
      url: nabuUrl
    })

  const fetchProductEligibilityForUser = () =>
    authorizedGet({
      endPoint: `/products`,
      url: nabuUrl
    })

  return {
    checkWithdrawalLocks,
    fetchProductEligibilityForUser,
    getBeneficiaries,
    getCrossBorderTransactions,
    getEligibilityForProduct,
    getLimitsAndFeaturesDetails,
    getTransactionsHistory,
    getWithdrawalFees,
    getWithdrawalLimits,
    getWithdrawalLocks,
    initiateCustodialTransfer,
    notifyNonCustodialToCustodialTransfer,
    withdrawFunds
  }
}
