import { combineReducers } from 'redux'
import { walletReducer, blockchainDataReducer } from 'dream-wallet/lib/reducers'
import login from './login'
import session from './session'

const reducers = ({wpath, dpath}) => combineReducers({
  loginState: login,
  session: session,
  [dpath]: blockchainDataReducer,
  [wpath]: walletReducer
})

export default reducers
