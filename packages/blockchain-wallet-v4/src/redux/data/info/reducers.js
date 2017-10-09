import { prop } from 'ramda'
import * as T from '../../actionTypes.js'

const INITIAL_STATE = {}

const infoReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case T.common.SET_BLOCKCHAIN_DATA: {
      return prop('wallet', payload)
    }
    default:
      return state
  }
}

export default infoReducer
