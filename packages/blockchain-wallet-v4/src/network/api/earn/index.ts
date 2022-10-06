import { CoinType, FiatType, WalletFiatType } from '@core/types'

import {
  EarnAccountBalanceResponseType,
  EarnAccountBalanceType,
  EarnAccountResponseType,
  EarnAccountType,
  EarnAfterTransactionType,
  EarnBondingDepositsParamType,
  EarnBondingDepositsResponseType,
  EarnDepositLimits,
  EarnEDDDocumentsResponse,
  EarnEDDStatus,
  EarnEligibleType,
  EarnTransactionParamType,
  EarnTransactionResponseType,
  FileUploadItem,
  InterestLimitsType,
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

  const getEarnBondingDeposits = ({
    ccy,
    product
  }: EarnBondingDepositsParamType): EarnBondingDepositsResponseType =>
    authorizedGet({
      endPoint: `/earn/bonding-txs?product=${product}&ccy=${ccy}&`,
      url: nabuUrl
    })

  const getEarnTransactions = ({
    currency,
    nextPageUrl,
    product
  }: EarnTransactionParamType): EarnTransactionResponseType =>
    nextPageUrl
      ? authorizedGet({
          endPoint: `${nextPageUrl}&pending=true&`,
          url: nabuUrl
        })
      : authorizedGet({
          data: {
            currency,
            pending: true,
            product
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
      endPoint: '/earn/rates-user?product=staking&',
      url: nabuUrl
    })

  const getEarnAccount = ({ coin, product }: EarnAccountType): EarnAccountResponseType =>
    authorizedGet({
      endPoint: `/payments/accounts/${product}?ccy=${coin}`,
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

  const getInterestCtaAfterTransaction = (currency?: WalletFiatType): EarnAfterTransactionType =>
    authorizedGet({
      data: {
        currency
      },
      endPoint: '/savings/cta/after-transaction',
      url: nabuUrl
    })

  const stopInterestCtaAfterTransaction = (enabled: boolean): EarnAfterTransactionType =>
    authorizedPut({
      data: {
        enabled
      },
      endPoint: '/savings/cta/after-transaction/enabled',
      url: nabuUrl
    })

  const getSavingsEDDStatus = (): EarnEDDStatus =>
    authorizedGet({
      endPoint: '/savings/edd/status',
      url: nabuUrl
    })

  const getSavingsEDDDepositLimits = (currency?: FiatType): EarnDepositLimits =>
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

  const getEDDDocumentsLimits = (): EarnEDDDocumentsResponse =>
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
    getEarnAccount,
    getEarnAccountBalance,
    getEarnBondingDeposits,
    getEarnTransactions,
    getInterestCtaAfterTransaction,
    getInterestEligible,
    getInterestLimits,
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
