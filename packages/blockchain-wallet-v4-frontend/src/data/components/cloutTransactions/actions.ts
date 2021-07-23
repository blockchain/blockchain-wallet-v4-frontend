import * as AT from './actionTypes'

export const initialized = () => ({ type: AT.TRANSACTIONS_INITIALIZED })

export const loadMore = () => ({
  type: AT.CLOUT_TRANSACTIONS_LOAD_MORE
})
