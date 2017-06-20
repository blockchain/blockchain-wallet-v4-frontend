import * as actions from './actions'

let assign = (state, next) => Object.assign({}, state, next)

const INITIAL_STATE = {
  culture: 'en-GB'
}

const preferences = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case actions.SET_CULTURE: {
      return assign(INITIAL_STATE, { culture: payload })
    }
    default:
      return state
  }
}

export default preferences
