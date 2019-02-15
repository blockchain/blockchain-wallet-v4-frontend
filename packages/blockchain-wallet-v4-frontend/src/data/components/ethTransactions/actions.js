import * as AT from './actionTypes'

export const initialized = () => ({ type: AT.ETH_TRANSACTIONS_INITIALIZED })

export const loadMore = () => ({
  type: AT.ETH_TRANSACTIONS_LOAD_MORE
})
