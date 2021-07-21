import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { CustodialActionTypes, CustodialState } from './types'

const INITIAL_STATE: CustodialState = {
  beneficiaries: Remote.NotAsked,
  recentSwapTxs: Remote.NotAsked
}

/* eslint-disable import/prefer-default-export */
export function custodialReducer(
  state = INITIAL_STATE,
  action: CustodialActionTypes
): CustodialState {
  switch (action.type) {
    case AT.FETCH_CUSTODIAL_BENEFICIARIES_FAILURE: {
      return {
        ...state,
        beneficiaries: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_CUSTODIAL_BENEFICIARIES_LOADING:
      return {
        ...state,
        beneficiaries: Remote.Loading
      }
    case AT.FETCH_CUSTODIAL_BENEFICIARIES_SUCCESS:
      return {
        ...state,
        beneficiaries: Remote.Success(action.payload.beneficiaries)
      }
    case AT.FETCH_RECENT_SWAP_TXS_FAILURE: {
      return {
        ...state,
        recentSwapTxs: Remote.Failure('Error getting recent swap txs')
      }
    }
    case AT.FETCH_RECENT_SWAP_TXS_LOADING: {
      return {
        ...state,
        recentSwapTxs: Remote.Loading
      }
    }
    case AT.FETCH_RECENT_SWAP_TXS_SUCCESS: {
      return {
        ...state,
        recentSwapTxs: Remote.Success(action.payload.data)
      }
    }
    default:
      return state
  }
}
