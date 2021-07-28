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
export const initializedErc20 = (token) => {
  return {
    payload: { token },
    type: AT.ERC20_TRANSACTIONS_INITIALIZED
  }
}

export const loadMoreErc20 = (token) => ({
  payload: { token },
  type: AT.ERC20_TRANSACTIONS_LOAD_MORE
})
