import { combineReducers } from 'redux'
import login from './login'

const reducers = combineReducers({
  loginState: login
})

export default reducers
