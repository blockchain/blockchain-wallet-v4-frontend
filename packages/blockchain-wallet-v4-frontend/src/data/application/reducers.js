import * as AT from './actionTypes'
import { assoc } from 'ramda'

const INITIAL_STATE = {
  isFetching: false
}

const application = (state = INITIAL_STATE, action) => {
  const { type } = action

  switch (type) {
    case AT.START_REQUEST: {
      return assoc('isFetching', true, state)
    }
    case AT.STOP_REQUEST: {
      return assoc('isFetching', false, state)
    }
    default:
      return state
  }
}

export default application
