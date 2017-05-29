
import { FETCH_ACTIVITIES, FETCH_ACTIVITIES_SUCCESSFUL, FETCH_ACTIVITIES_FAILED } from '../actionTypes'

let assign = (state, next) => Object.assign({}, state, next)

const INITIAL_STATE = {
  activities: []
}

const header = (state = INITIAL_STATE, action) => {

  switch (action.type) {
    case FETCH_ACTIVITIES: {
      return state
    }
    case FETCH_ACTIVITIES_SUCCESSFUL: {
      return assign(INITIAL_STATE, { activities: Array.from(action.activities) })
    }
    case FETCH_ACTIVITIES_FAILED: {
      return state
    }
    default:
      return state
  }
}

export default header
