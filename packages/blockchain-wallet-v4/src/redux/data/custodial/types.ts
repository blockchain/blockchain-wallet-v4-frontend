import {
  CoinType,
  FiatType,
  ProcessedSwapOrderType,
  SBOrderType,
  SBTransactionStateType,
  SBTransactionType,
  WalletCurrencyType
} from 'core/types'

import * as AT from './actionTypes'

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

// 🚨 TEMP HACK 🚨
// TODO: remove once we have unified custodial transaction endpoints
export type FiatSBAndSwapTransactionType = {
  amount: {
    fiatSymbol?: FiatType
    inputMoney?: string
    symbol: CoinType
    value: string
  }
  amountMinor: string
  extraAttributes: null | {
    address: string
    amount: {
      [key in WalletCurrencyType]: number
    }
    confirmations: number
    direction?: 'FROM_USERKEY' | 'INTERNAL'
    dsr: number
    hash: string
    id: string
    indicativePrice?: string
    status: 'UNCONFIRMED' | 'CONFIRMED'
    txHash: string
  }
  id: string
  insertedAt: string
  state: SBTransactionStateType | 'FINISHED'
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'REFUNDED' | 'SELL'
}
