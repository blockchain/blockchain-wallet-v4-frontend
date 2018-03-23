
import { combineReducers } from 'redux'
import { formReducer } from './form/reducers'

export default combineReducers({
  form: formReducer
})
