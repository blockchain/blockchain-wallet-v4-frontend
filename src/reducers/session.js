import { SAVE_SESSION } from '../actions/actionTypes'
import { merge } from 'ramda'

const session = (state = {}, action) => {
  let { type } = action
  switch (type) {
    case SAVE_SESSION: {
      return merge(state, action.payload)
    }
    default:
      return state
  }
}

export default session
