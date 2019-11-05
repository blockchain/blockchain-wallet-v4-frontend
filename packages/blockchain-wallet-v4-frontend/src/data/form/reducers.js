import * as AT from './actionTypes'
import { assocPath } from 'ramda'
import { reducer as formReducer } from 'redux-form'

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
      return assocPath([...form.split('.'), 'values', field], value, state)
    }
    default:
      return state
  }
}

export default reducerReducers(formReducer, extendedReducer)
