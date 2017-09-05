import { prop } from 'ramda'
import * as T from '../../actionTypes.js'

const INITIAL_STATE = {}

const infoReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case T.common.FETCH_BLOCKCHAIN_DATA_SUCCESS: {
      let { payload } = action
      return prop('wallet', payload)
    }
    default:
      return state
  }
}

export default infoReducer
