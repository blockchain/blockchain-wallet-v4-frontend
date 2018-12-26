import * as AT from './actionTypes'

export const initialized = () => ({ type: AT.BSV_TRANSACTIONS_INITIALIZED })

export const loadMore = () => ({
  type: AT.BSV_TRANSACTIONS_LOAD_MORE
})
