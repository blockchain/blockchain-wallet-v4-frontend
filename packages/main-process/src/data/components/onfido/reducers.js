import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'
export const INITIAL_STATE = {
  onfidoSDKKey: Remote.NotAsked,
  onfidoSyncStatus: Remote.NotAsked,
  applicantId: ''
}
export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.FETCH_ONFIDO_SDK_KEY_ERROR: {
      return assoc('onfidoSDKKey', Remote.Failure(payload.message), state)
    }
    case AT.FETCH_ONFIDO_SDK_KEY_LOADING: {
      return assoc('onfidoSDKKey', Remote.Loading, state)
    }
    case AT.FETCH_ONFIDO_SDK_KEY_SUCCESS: {
      return assoc('onfidoSDKKey', Remote.Success(payload.onfidoSDKKey), state)
    }
    case AT.SYNC_ONFIDO_ERROR: {
      return assoc('onfidoSyncStatus', Remote.Failure(payload.message), state)
    }
    case AT.SYNC_ONFIDO_LOADING: {
      return assoc('onfidoSyncStatus', Remote.Loading, state)
    }
    case AT.SYNC_ONFIDO_SUCCESS: {
      return assoc('onfidoSyncStatus', Remote.Success(true), state)
    }
    case AT.SET_ONFIDO_APPLICANT_ID: {
      return assoc('applicantId', payload.applicantId, state)
    }
    default:
      return state
  }
}
