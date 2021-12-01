import {
  BSOrderType,
  BSTransactionStateType,
  BSTransactionType,
  CoinType,
  FiatType,
  ProcessedSwapOrderType,
  WalletCurrencyType
} from '@core/types'

import * as AT from './actionTypes'

export type FetchCustodialOrdersAndTransactionsReturnType = {
  orders: Array<BSOrderType | BSTransactionType | ProcessedSwapOrderType>
}

// state
export type BSCoreStateType = {
  coins: {
    [key in string]: {
      nextBSTransactionsURL: string | null
      pendingTxsN: number
    }
  }
}

// actions
interface SetNextBSTransactionsURL {
  payload: {
    coin: WalletCurrencyType
    next: string | null
    pendingTxsN: number
  }
  type: typeof AT.SET_BS_CORE_COIN_DATA
}

export type BSCoreActionTypes = SetNextBSTransactionsURL

// 🚨 TEMP HACK 🚨
// TODO: remove once we have unified custodial transaction endpoints
export type FiatBSAndSwapTransactionType = {
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
  state: BSTransactionStateType | 'FINISHED'
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'REFUNDED' | 'SELL' | 'CHARGE'
}
