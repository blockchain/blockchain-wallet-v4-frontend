import * as AT from './actionTypes'

let assign = (state, next) => Object.assign({}, state, next)

const INITIAL_STATE = {
  culture: 'en-GB',
  language: 'en'
}

const preferences = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.SET_CULTURE: {
      return assign(INITIAL_STATE, { culture: payload })
    }
    case AT.SET_LANGUAGE: {
      return assign(INITIAL_STATE, { language: payload })
    }
    default:
      return state
  }
}

export default preferences
