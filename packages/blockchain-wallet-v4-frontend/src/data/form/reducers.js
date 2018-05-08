import * as AT from './actionTypes'
import { reducer as formReducer } from 'redux-form'
import { assocPath } from 'ramda'

const reducerReducers = (...reducers) => (prevState, value, ...args) =>
  reducers.reduce(
    (newState, reducer) => reducer(newState, value, ...args),
    prevState
  )

const extendedReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.CHANGE2: {
      const { form, field, value } = payload
      return assocPath([form, 'values', field], value, state)
    }
    default: return state
  }
}

export default reducerReducers(formReducer, extendedReducer)
