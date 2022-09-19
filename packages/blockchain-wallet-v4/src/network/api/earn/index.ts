import { CoinType, FiatType, WalletFiatType } from '@core/types'

import {
  EarnAccountBalanceResponseType,
  EarnAccountBalanceType,
  EarnEligibleType,
  FileUploadItem,
  InterestAccountType,
  InterestAfterTransactionType,
  InterestDepositLimits,
  InterestEDDDocumentsResponse,
  InterestEDDStatus,
  InterestLimitsType,
  InterestTransactionResponseType,
  InterestWithdrawalResponseType,
  RewardsRatesType,
  StakingAccountType,
  StakingLimitsResponse,
  StakingRatesType,
  UploadDocumentDetails,
  WithdrawalMinimumTypeResponse,
  WithdrawLimits
} from './types'

export default ({ authorizedGet, authorizedPost, authorizedPut, nabuUrl }) => {
  // TODO - consider removing parameters since we never pass anything here
  const getEarnAccountBalance = ({
    ccy,
    din,
    product
  }: EarnAccountBalanceType): EarnAccountBalanceResponseType =>
    authorizedGet({
      data: {
        ccy,
        din
      },
      endPoint: `/accounts/${product}`,
      url: nabuUrl
    })

  const getInterestEligible = (): EarnEligibleType =>
    authorizedGet({
      endPoint: '/savings/eligible',
      url: nabuUrl
    })

  const getStakingEligible = (): EarnEligibleType =>
    authorizedGet({
      endPoint: '/earn/eligible?product=staking&',
      url: nabuUrl
    })

  const getInterestLimits = (ccy: CoinType, currency: FiatType): { limits: InterestLimitsType } =>
    authorizedGet({
      endPoint: `/savings/limits?ccy=${ccy}&currency=${currency}&`,
      url: nabuUrl
    })

  const getInterestTransactions = (
    currency?: CoinType,
    nextPageUrl?: string
  ): InterestTransactionResponseType =>
    nextPageUrl
      ? authorizedGet({
          endPoint: `${nextPageUrl}&pending=true&`,
          url: nabuUrl
        })
      : authorizedGet({
          data: {
            currency,
            pending: true,
            product: 'SAVINGS'
          },
          endPoint: '/payments/transactions',
          url: nabuUrl
        })

  const getRewardsRates = (): RewardsRatesType =>
    authorizedGet({
      endPoint: '/savings/rates',
      url: nabuUrl
    })

  const getStakingRates = (): StakingRatesType =>
    authorizedGet({
      endPoint: '/earn/rates?product=staking&',
      url: nabuUrl
    })

  const getInterestAccount = (ccy: CoinType): InterestAccountType =>
    authorizedGet({
      endPoint: `/payments/accounts/savings?ccy=${ccy}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getStakingAccount = (ccy: CoinType): StakingAccountType =>
    authorizedGet({
      endPoint: `/payments/accounts/staking?ccy=${ccy}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getWithdrawalMinsAndFees = (): WithdrawalMinimumTypeResponse =>
    authorizedGet({
      endPoint: '/payments/withdrawals/fees?product=SAVINGS',
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const initiateInterestWithdrawal = (
    amount: string,
    currency: CoinType,
    withdrawalAddress: string
  ): InterestWithdrawalResponseType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        amount,
        currency,
        withdrawalAddress
      },
      endPoint: '/savings/withdrawals',
      url: nabuUrl
    })

  const getInterestCtaAfterTransaction = (
    currency?: WalletFiatType
  ): InterestAfterTransactionType =>
    authorizedGet({
      data: {
        currency
      },
      endPoint: '/savings/cta/after-transaction',
      url: nabuUrl
    })

  const stopInterestCtaAfterTransaction = (enabled: boolean): InterestAfterTransactionType =>
    authorizedPut({
      data: {
        enabled
      },
      endPoint: '/savings/cta/after-transaction/enabled',
      url: nabuUrl
    })

  const getSavingsEDDStatus = (): InterestEDDStatus =>
    authorizedGet({
      endPoint: '/savings/edd/status',
      url: nabuUrl
    })

  const getSavingsEDDDepositLimits = (currency?: FiatType): InterestDepositLimits =>
    authorizedGet({
      data: {
        currency
      },
      endPoint: '/savings/edd/limits/deposit',
      url: nabuUrl
    })

  const getSavingsEDDWithdrawLimits = (currency: FiatType): WithdrawLimits =>
    authorizedGet({
      data: {
        currency
      },
      endPoint: '/savings/edd/limits/withdraw',
      url: nabuUrl
    })

  const storeEDDDocuments = (uploadFiles: FileUploadItem[]) =>
    authorizedPut({
      contentType: 'application/json',
      data: {
        data: uploadFiles
      },
      endPoint: '/savings/edd/documents',
      url: nabuUrl
    })

  const storeEDDData = (eddData: UploadDocumentDetails) =>
    authorizedPut({
      contentType: 'application/json',
      data: eddData,
      endPoint: '/savings/edd/data',
      url: nabuUrl
    })

  const getEDDDocumentsLimits = (): InterestEDDDocumentsResponse =>
    authorizedGet({
      endPoint: '/savings/edd/documents/limits',
      url: nabuUrl
    })

  const getStakingLimits = (): StakingLimitsResponse =>
    authorizedGet({
      endPoint: '/earn/limits?product=staking&',
      url: nabuUrl
    })

  return {
    getEDDDocumentsLimits,
    getEarnAccountBalance,
    getInterestAccount,
    getInterestCtaAfterTransaction,
    getInterestEligible,
    getInterestLimits,
    getInterestTransactions,
    getRewardsRates,
    getSavingsEDDDepositLimits,
    getSavingsEDDStatus,
    getSavingsEDDWithdrawLimits,
    getStakingAccount,
    getStakingEligible,
    getStakingLimits,
    getStakingRates,
    getWithdrawalMinsAndFees,
    initiateInterestWithdrawal,
    stopInterestCtaAfterTransaction,
    storeEDDData,
    storeEDDDocuments
  }
}
