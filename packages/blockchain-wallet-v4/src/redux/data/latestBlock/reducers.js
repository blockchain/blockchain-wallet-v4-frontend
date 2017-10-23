import { path } from 'ramda'
import * as actionTypes from '../../actionTypes.js'
import * as AT from './actionTypes.js'

const INITIAL_STATE = {}

const latestBlockReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case actionTypes.common.SET_BLOCKCHAIN_DATA: {
      return path(['info', 'latest_block'], payload)
    }
    case AT.SET_LATEST_BLOCK: {
      return payload
    }
    default:
      return state
  }
}

export default latestBlockReducer
