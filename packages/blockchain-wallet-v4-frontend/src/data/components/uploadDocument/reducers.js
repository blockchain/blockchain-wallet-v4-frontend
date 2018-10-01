import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

export const INITIAL_STATE = {
  uploadStatus: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.UPLOAD_ERROR: {
      return assoc('uploadStatus', Remote.Failure(payload.message), state)
    }
    case AT.UPLOAD_LOADING: {
      return assoc('uploadStatus', Remote.Loading, state)
    }
    case AT.UPLOAD_SUCCESS: {
      return assoc(
        'uploadStatus',
        Remote.Success('Document successfully uploaded'),
        state
      )
    }
    default:
      return state
  }
}
