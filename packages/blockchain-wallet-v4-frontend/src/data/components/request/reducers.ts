import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { RequestActionTypes, RequestState } from './types'

const INITIAL_STATE = {}

export function requestReducer(
  state = INITIAL_STATE,
  action: RequestActionTypes
): RequestState {
  switch (action.type) {
    case AT.GET_NEXT_ADDRESS_FAILURE:
      return {
        ...state,
        [action.payload.key]: Remote.Failure(action.payload.error)
      }
    case AT.GET_NEXT_ADDRESS_LOADING:
      return {
        ...state,
        [action.payload.key]: Remote.Loading
      }
    case AT.GET_NEXT_ADDRESS_SUCCESS:
      return {
        ...state,
        [action.payload.key]: Remote.Success(action.payload.address)
      }
    default:
      return state
  }
}
