import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { SettingsActionTypes, SettingsState } from './types'

const INITIAL_STATE: SettingsState = {
  productsEligibility: Remote.NotAsked
}

export function settingsReducer(
  state = INITIAL_STATE,
  action: SettingsActionTypes
): SettingsState {
  switch (action.type) {
    case AT.FETCH_PRODUCTS_ELIGIBILITY_FAILURE: {
      return {
        ...state,
        productsEligibility: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_PRODUCTS_ELIGIBILITY_LOADING: {
      return {
        ...state,
        productsEligibility: Remote.Loading
      }
    }
    case AT.FETCH_PRODUCTS_ELIGIBILITY_SUCCESS: {
      return {
        ...state,
        productsEligibility: Remote.Success(action.payload.productsEligibility)
      }
    }
    default:
      return state
  }
}
