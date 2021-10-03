import { ISelection, RemoteDataType } from 'core/types'

import * as AT from './actionTypes'

export type FundRecoveryStateType = {
  [key in string]: {
    chainSearch: RemoteDataType<string, SearchChainSuccessActionType['payload']>
    fundRecoveryStatus: RemoteDataType<string, string>
  }
}

interface RecoverFundsFailureActionType {
  payload: {
    coin: string
    error: string
  }
  type: typeof AT.RECOVER_FUNDS_FAILURE
}

interface RecoverFundsLoadingActionType {
  payload: {
    coin: string
  }
  type: typeof AT.RECOVER_FUNDS_LOADING
}

interface RecoverFundsSuccessActionType {
  payload: {
    coin: string
  }
  type: typeof AT.RECOVER_FUNDS_SUCCESS
}

interface ResetFundRecoveryActionType {
  type: typeof AT.RESET_FUND_RECOVERY
}

interface SearchChainFailureActionType {
  payload: {
    coin: string
    error: string
  }
  type: typeof AT.SEARCH_CHAIN_FOR_FUNDS_FAILURE
}

interface SearchChainLoadingActionType {
  payload: {
    coin: string
  }
  type: typeof AT.SEARCH_CHAIN_FOR_FUNDS_LOADING
}

interface SearchChainSuccessActionType {
  payload: {
    coin: string
    derivation: any
    selection: ISelection
  }
  type: typeof AT.SEARCH_CHAIN_FOR_FUNDS_SUCCESS
}

export type FundRecoveryActionType =
  | RecoverFundsFailureActionType
  | RecoverFundsLoadingActionType
  | RecoverFundsSuccessActionType
  | ResetFundRecoveryActionType
  | SearchChainFailureActionType
  | SearchChainLoadingActionType
  | SearchChainSuccessActionType
