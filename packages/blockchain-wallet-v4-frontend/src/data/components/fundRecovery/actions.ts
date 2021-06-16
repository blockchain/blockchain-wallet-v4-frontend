import { ISelection } from 'core/types'

import * as AT from './actionTypes'
import { FundRecoveryActionType } from './types'

export const recoverFunds = (coin: string) => ({
  payload: {
    coin
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

export const searchChain = (accountIndex: number, coin: string) => ({
  payload: {
    accountIndex,
    coin
  },
  type: AT.SEARCH_CHAIN_FOR_FUNDS
})

export const searchChainFailure = (coin: string, error: string): FundRecoveryActionType => ({
  payload: {
    coin,
    error
  },
  type: AT.SEARCH_CHAIN_FOR_FUNDS_FAILURE
})

export const searchChainLoading = (coin: string): FundRecoveryActionType => ({
  payload: {
    coin
  },
  type: AT.SEARCH_CHAIN_FOR_FUNDS_LOADING
})

export const searchChainSuccess = (coin: any, derivation: any, selection: ISelection) => ({
  payload: {
    coin,
    derivation,
    selection
  },
  type: AT.SEARCH_CHAIN_FOR_FUNDS_SUCCESS
})
