// -- EXPOSE ALL REDUCERS (INCLUDING REDUCERS FROM THE CORE) -- //
import { assoc } from 'ramda'
import { combineReducers } from 'redux'
import { coreReducers, paths } from 'blockchain-wallet-v4/src'
import authReducer from './auth/reducers'

const rootReducer = combineReducers({
  auth: authReducer,
  [paths.dataPath]: coreReducers.data,
  [paths.walletPath]: coreReducers.wallet,
  [paths.settingsPath]: coreReducers.settings,
  [paths.walletOptionsPath]: coreReducers.walletOptions,
  [paths.kvStorePath]: coreReducers.kvStore,
})

export default rootReducer
