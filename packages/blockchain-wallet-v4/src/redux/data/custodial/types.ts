import * as AT from './actionTypes'
import {
  ProcessedSwapOrderType,
  SBOrderType,
  SBTransactionType,
  WalletCurrencyType
} from 'core/types'

export type FetchCustodialOrdersAndTransactionsReturnType = {
  orders: Array<SBOrderType | SBTransactionType | ProcessedSwapOrderType>
}

// state
export type SBCoreStateType = {
  [key in WalletCurrencyType]: {
    nextSBTransactionsURL: string | null
    pendingTxsN: number
  }
}

// actions
interface SetNextSBTransactionsURL {
  payload: {
    coin: WalletCurrencyType
    next: string | null
    pendingTxsN: number
  }
  type: typeof AT.SET_SB_CORE_COIN_DATA
}

export type SBCoreActionTypes = SetNextSBTransactionsURL
