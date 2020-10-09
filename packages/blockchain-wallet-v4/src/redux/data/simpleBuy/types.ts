import * as AT from './actionTypes'
import { SBOrderType, SBTransactionType, WalletCurrencyType } from 'core/types'

export type FetchSBOrdersAndTransactionsReturnType = {
  orders: Array<SBOrderType | SBTransactionType>
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
