import {combineReducers} from 'redux'
import lnReducer from '../../src/ln/reducer'

const lnRootReducer = combineReducers({
  ln: lnReducer
})

export default lnRootReducer
