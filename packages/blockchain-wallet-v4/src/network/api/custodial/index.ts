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
  DepositTerms,
  NabuProductType,
  ProductEligibilityForUser,
  ProductEligibilityResponse,
  WithdrawLimitsResponse
} from 'data/types'

import { BSTransactionsType } from '../buySell/types'
import {
  BeneficiariesType,
  BeneficiaryType,
  CustodialToNonCustodialWithdrawalFeesResponseType,
  CustodialToNonCustodialWithdrawalFeesType,
  CustodialTransferRequestType,
  GetTransactionsHistoryType,
  MaxCustodialWithdrawalFeeType,
  NabuCustodialProductType,
  NabuMoneyFloatType,
  PaymentDepositPendingResponseType,
  ProductTypes,
  WithdrawalFeesProductType,
  WithdrawalLockCheckResponseType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse,
  WithdrawResponseType
} from './types'

export default ({ authorizedGet, authorizedPost, authorizedPut, nabuUrl }) => {
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

  const getDepositTerms = (
    amount: NabuMoneyFloatType,
    paymentMethodId: string,
    product = ProductTypes.WALLET,
    purpose = ProductTypes.DEPOSIT
  ): DepositTerms =>
    authorizedPut({
      contentType: 'application/json',
      data: {
        amount,
        paymentMethodId,
        product,
        purpose
      },
      endPoint: '/payments/deposit/terms',
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

  const getMaxCustodialWithdrawalFee = ({
    currency,
    fiatCurrency,
    paymentMethod
  }: MaxCustodialWithdrawalFeeType): CustodialToNonCustodialWithdrawalFeesResponseType =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/withdrawals/fees?product=WALLET&max=true&currency=${currency}&fiatCurrency=${fiatCurrency}&paymentMethod=${paymentMethod}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getCustodialToNonCustodialWithdrawalFees = ({
    amount,
    currency,
    fiatCurrency,
    paymentMethod
  }: CustodialToNonCustodialWithdrawalFeesType): CustodialToNonCustodialWithdrawalFeesResponseType =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/withdrawals/fees?product=WALLET&amount=${amount}&currency=${currency}&fiatCurrency=${fiatCurrency}&paymentMethod=${paymentMethod}`,
      ignoreQueryParams: true,
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

  const getLimitsAndFeaturesDetails = (tier?: string) =>
    authorizedGet({
      data: {
        tier
      },
      endPoint: `/limits/overview`,
      url: nabuUrl
    })

  const fetchProductEligibilityForUser = (): ProductEligibilityForUser =>
    authorizedGet({
      data: {
        product: 'SIMPLEBUY'
      },
      endPoint: `/products`,
      url: nabuUrl
    })

  return {
    checkWithdrawalLocks,
    fetchProductEligibilityForUser,
    getBeneficiaries,
    getCrossBorderTransactions,
    getCustodialToNonCustodialWithdrawalFees,
    getDepositTerms,
    getEligibilityForProduct,
    getLimitsAndFeaturesDetails,
    getMaxCustodialWithdrawalFee,
    getTransactionsHistory,
    getWithdrawalFees,
    getWithdrawalLimits,
    getWithdrawalLocks,
    initiateCustodialTransfer,
    notifyNonCustodialToCustodialTransfer,
    withdrawFunds
  }
}
