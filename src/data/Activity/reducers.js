import { FETCH_ACTIVITIES, FETCH_ACTIVITIES_SUCCESSFUL, FETCH_ACTIVITIES_FAILED } from '../actionTypes'

const INITIAL_STATE = []

const activity = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_ACTIVITIES: {
      return state
    }
    case FETCH_ACTIVITIES_SUCCESSFUL: {
      return Array.from(action.activities)
    }
    case FETCH_ACTIVITIES_FAILED: {
      return state
    }
    default:
      return state
  }
}

export default activity
