import { UnspentResponseType } from 'blockchain-wallet-v4/src/network/api/btc/types'

import * as AT from './actionTypes'
import { FundRecoveryActionType } from './types'

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
  data: UnspentResponseType['unspent_outputs']
): FundRecoveryActionType => ({
  payload: {
    accountIndex,
    coin,
    data,
    derivationType
  },
  type: AT.SEARCH_CHAIN_FOR_FUNDS_SUCCESS
})
