import { assocPath } from 'ramda'
import { reducer as formReducer } from 'redux-form'

import * as AT from './actionTypes'

const reducerReducers = (...reducers) => (prevState, value, ...args) =>
  reducers.reduce(
    (newState, reducer) => reducer(newState, value, ...args),
    prevState
  )

const extendedReducer = (state, action) => {
  const { payload, type } = action
  switch (type) {
    case AT.CHANGE2: {
      const { field, form, value } = payload
      return assocPath([...form.split('.'), 'values', field], value, state)
    }
    default:
      return state
  }
}

export default reducerReducers(formReducer, extendedReducer)
