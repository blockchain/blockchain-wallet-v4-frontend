import * as actions from 'data'
import { append } from 'ramda'

const INITIAL_STATE = []

const log = (state = INITIAL_STATE, action) => {
  let { type, payload } = action
  switch (type) {
    case actions.RECORD_LOG: {
      return append(payload, state)
    }
    default:
      return state
  }
}

export default log
