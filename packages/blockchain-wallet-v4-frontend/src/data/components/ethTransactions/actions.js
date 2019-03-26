import * as AT from './actionTypes'

//
// ETH
//
export const initialized = () => ({ type: AT.ETH_TRANSACTIONS_INITIALIZED })

export const loadMore = () => ({
  type: AT.ETH_TRANSACTIONS_LOAD_MORE
})

//
// ERC20
//
export const initializedErc20 = token => ({
  type: AT.ETH_TRANSACTIONS_INITIALIZED,
  payload: token
})

export const loadMoreErc20 = token => ({
  type: AT.ETH_TRANSACTIONS_LOAD_MORE,
  payload: token
})
