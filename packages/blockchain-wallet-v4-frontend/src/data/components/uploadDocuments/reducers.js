import { assoc } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'

import * as AT from './actionTypes'

export const INITIAL_STATE = {
  data: null,
  reference: null,
  uploaded: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.SET_DATA: {
      return assoc('data', payload.data, state)
    }
    case AT.SET_REFERENCE: {
      return assoc('reference', payload.reference, state)
    }
    case AT.SET_UPLOADED_LOADING: {
      return assoc('uploaded', Remote.Loading, state)
    }
    case AT.SET_UPLOADED_SUCCESS: {
      return assoc('uploaded', Remote.Success(payload), state)
    }
    case AT.SET_UPLOADED_FAILURE: {
      return assoc('uploaded', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}
