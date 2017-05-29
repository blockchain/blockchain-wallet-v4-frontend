import { combineReducers } from 'redux'
import { walletReducer, blockchainDataReducer } from 'dream-wallet/lib/reducers'
import login from './login'
import session from './session'
import header from '../data/Header/reducers.js'
import activity from '../data/Activity/reducers.js'

const reducers = ({wpath, dpath}) => combineReducers({
  loginState: login,
  session: session,
  headerState: header,
  activityState: activity,
  [dpath]: blockchainDataReducer,
  [wpath]: walletReducer
})

export default reducers
