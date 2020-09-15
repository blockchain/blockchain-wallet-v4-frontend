import * as AT from './actionTypes'

export const initialized = () => ({ type: AT.BTC_TRANSACTIONS_INITIALIZED })

export const loadMore = () => ({
  type: AT.BTC_TRANSACTIONS_LOAD_MORE
})
