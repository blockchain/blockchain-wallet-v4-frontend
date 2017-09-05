import * as AT from './actionTypes'
import { lensPath, set } from 'ramda'
import { reducer as formReducer } from 'redux-form'

const form = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_STEP: {
      const { formName, step } = payload
      let lens = lensPath([formName, 'step'])
      return set(lens, step, state)
    }
    default:
      return formReducer(state, action)
  }
}

export default form
