import * as AT from './actionTypes'
import { FiatType } from 'core/types'

export const initialized = (currency: FiatType) => ({
  type: AT.FIAT_TRANSACTIONS_INITIALIZED,
  payload: { currency }
})

export const loadMore = (currency: FiatType) => ({
  type: AT.FIAT_TRANSACTIONS_LOAD_MORE,
  payload: { currency }
})
