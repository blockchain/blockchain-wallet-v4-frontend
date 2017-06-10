import * as A from './actions'

const INITIAL_STATE = {}

const settingsReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case A.SETTINGS_DATA_LOAD: {
      let { payload } = action
      return payload
    }
    default:
      return state
  }
}

export default settingsReducer
