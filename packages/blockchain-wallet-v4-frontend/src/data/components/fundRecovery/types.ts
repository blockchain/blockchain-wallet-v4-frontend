import { UnspentResponseType } from 'blockchain-wallet-v4/src/network/api/btc/types'
import { RemoteDataType } from 'core/types'

import * as AT from './actionTypes'

export type FundRecoveryStateType = {
  unspents: {
    [key in string]: RemoteDataType<string, UnspentResponseType['unspent_outputs']>
  }
}

interface SearchChainFailureActionType {
  payload: {
    accountIndex: number
    coin: string
    derivationType: string
    error: string
  }
  type: typeof AT.SEARCH_CHAIN_FOR_FUNDS_FAILURE
}

interface SearchChainLoadingActionType {
  payload: {
    accountIndex: number
    coin: string
    derivationType: string
  }
  type: typeof AT.SEARCH_CHAIN_FOR_FUNDS_LOADING
}

interface SearchChainSuccessActionType {
  payload: {
    accountIndex: number
    coin: string
    data: UnspentResponseType['unspent_outputs']
    derivationType: string
  }
  type: typeof AT.SEARCH_CHAIN_FOR_FUNDS_SUCCESS
}

export type FundRecoveryActionType =
  | SearchChainFailureActionType
  | SearchChainLoadingActionType
  | SearchChainSuccessActionType
