import * as AT from './actionTypes'
import { WalletFiatType } from 'core/types'

export const initialized = (currency: WalletFiatType) => ({
  type: AT.FIAT_TRANSACTIONS_INITIALIZED,
  payload: { currency }
})

export const loadMore = (currency: WalletFiatType) => ({
  type: AT.FIAT_TRANSACTIONS_LOAD_MORE,
  payload: { currency }
})
