import { toLower } from 'ramda'

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
export const initializedErc20 = token => {
  return {
    type: AT.ERC20_TRANSACTIONS_INITIALIZED,
    payload: { token: toLower(token) }
  }
}

export const loadMoreErc20 = token => ({
  type: AT.ERC20_TRANSACTIONS_LOAD_MORE,
  payload: { token: toLower(token) }
})
