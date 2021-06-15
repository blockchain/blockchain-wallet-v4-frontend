import { UnspentResponseType } from 'blockchain-wallet-v4/src/network/api/btc/types'

import * as AT from './actionTypes'
import { FundRecoveryActionType } from './types'

export const recoverFunds = (
  accountIndex: number,
  unspent_outputs: UnspentResponseType['unspent_outputs'],
  coin: string,
  fromDerivationType: string,
  recoveryAddress: string,
  badChange?: string[]
) => ({
  payload: {
    accountIndex,
    badChange,
    coin,
    fromDerivationType,
    recoveryAddress,
    unspent_outputs
  },
  type: AT.RECOVER_FUNDS
})

export const recoverFundsFailure = (coin: string, error: string): FundRecoveryActionType => ({
  payload: {
    coin,
    error
  },
  type: AT.RECOVER_FUNDS_FAILURE
})

export const recoverFundsLoading = (coin: string): FundRecoveryActionType => ({
  payload: {
    coin
  },
  type: AT.RECOVER_FUNDS_LOADING
})

export const recoverFundsSuccess = (coin: string): FundRecoveryActionType => ({
  payload: {
    coin
  },
  type: AT.RECOVER_FUNDS_SUCCESS
})

export const resetFundRecovery = () => ({
  type: AT.RESET_FUND_RECOVERY
})

export const searchChain = (accountIndex: number, coin: string, derivationType: string) => ({
  payload: {
    accountIndex,
    coin,
    derivationType
  },
  type: AT.SEARCH_CHAIN_FOR_FUNDS
})

export const searchChainFailure = (
  accountIndex: number,
  coin: string,
  derivationType: string,
  error: string
): FundRecoveryActionType => ({
  payload: {
    accountIndex,
    coin,
    derivationType,
    error
  },
  type: AT.SEARCH_CHAIN_FOR_FUNDS_FAILURE
})

export const searchChainLoading = (
  accountIndex: number,
  coin: string,
  derivationType: string
): FundRecoveryActionType => ({
  payload: {
    accountIndex,
    coin,
    derivationType
  },
  type: AT.SEARCH_CHAIN_FOR_FUNDS_LOADING
})

export const searchChainSuccess = (
  accountIndex: number,
  coin: string,
  derivationType: string,
  data: UnspentResponseType['unspent_outputs'],
  recoveryAddress: string,
  badChange?: string[]
) => ({
  payload: {
    accountIndex,
    badChange,
    coin,
    data,
    derivationType,
    recoveryAddress
  },
  type: AT.SEARCH_CHAIN_FOR_FUNDS_SUCCESS
})
