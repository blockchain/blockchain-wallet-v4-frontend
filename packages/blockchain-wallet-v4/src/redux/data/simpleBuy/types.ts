import * as AT from './actionTypes'
import { SBOrderType, SBTransactionType, WalletCurrencyType } from 'core/types'

export type FetchSBOrdersAndTransactionsReturnType = {
  orders: Array<SBOrderType | SBTransactionType>
}

// state
export type SBCoreStateType = {
  [key in WalletCurrencyType]: {
    nextSBTransactionsURL: string | null
  }
}

// actions
interface SetNextSBTransactionsURL {
  payload: {
    coin: WalletCurrencyType
    next: string | null
  }
  type: typeof AT.SET_NEXT_SB_TRANSACTIONS_URL
}

export type SBCoreActionTypes = SetNextSBTransactionsURL
