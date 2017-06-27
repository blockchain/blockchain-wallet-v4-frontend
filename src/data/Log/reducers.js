import * as AT from './actionTypes'
import { append } from 'ramda'

const INITIAL_STATE = []

const log = (state = INITIAL_STATE, action) => {
  let { type, payload } = action
  switch (type) {
    case AT.RECORD_LOG: {
      return append(payload, state)
    }
    default:
      return state
  }
}

export default log
