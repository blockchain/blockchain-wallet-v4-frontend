import { combineReducers } from 'redux'
import { walletReducer, blockchainDataReducer } from 'dream-wallet/lib/reducers'
import login from './login'
import session from './session'
import header from '../data/Header/reducers.js'

const reducers = ({wpath, dpath}) => combineReducers({
  loginState: login,
  session: session,
  headerState: header,
  [dpath]: blockchainDataReducer,
  [wpath]: walletReducer
})

export default reducers
