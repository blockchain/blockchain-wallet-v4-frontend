import {combineReducers} from 'redux';
import activityReducer from './Activity/reducers.js'
import headerReducer from './Header/reducers.js'

const rootReducer = combineReducers({
  activityState: activityReducer,
  headerState: headerReducer
})

export default rootReducer
