import { assoc, keys, map, mergeAll } from 'ramda'

import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { PricesStateType } from './types'

const INITIAL_STATE: PricesStateType = {
  current: Remote.NotAsked,
  previousDay: Remote.NotAsked
}

const createPricesKvPairs = (prices) => {
  return mergeAll(
    map(
      (x) => ({
        // @ts-ignore
        [x.split('-')[0]]: prices[x].price
      }),
      keys(prices)
    )
  )
}

export const pricesReducer = (state = INITIAL_STATE, action): PricesStateType => {
  switch (action.type) {
    case AT.FETCH_COIN_PRICES_LOADING: {
      return assoc('current', Remote.Loading, state)
    }
    case AT.FETCH_COIN_PRICES_SUCCESS: {
      return assoc('current', Remote.Success(createPricesKvPairs(action.payload)), state)
    }
    case AT.FETCH_COIN_PRICES_FAILURE: {
      return assoc('current', Remote.Failure(action.payload), state)
    }
    case AT.FETCH_COIN_PRICES_PREVIOUS_DAY_LOADING: {
      return assoc('previousDay', Remote.Loading, state)
    }
    case AT.FETCH_COIN_PRICES_PREVIOUS_DAY_SUCCESS: {
      return assoc('previousDay', Remote.Success(createPricesKvPairs(action.payload)), state)
    }
    case AT.FETCH_COIN_PRICES_PREVIOUS_DAY_FAILURE: {
      return assoc('previousDay', Remote.Failure(action.payload), state)
    }
    default:
      return state
  }
}

export default pricesReducer
