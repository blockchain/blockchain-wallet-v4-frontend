
import { combineReducers } from 'redux'
import componentReducer from './components/reducers.js'
import dataReducer from './data/reducers.js'
import moduleReducer from './modules/reducers.js'

export default combineReducers({
  components: componentReducer,
  data: dataReducer,
  modules: moduleReducer
})
