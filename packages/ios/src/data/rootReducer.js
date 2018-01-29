import * as AT from './actionTypes'
import { assoc } from 'ramda'
import { combineReducers } from 'redux'

import { coreReducers, paths } from 'blockchain-wallet-v4/src'
import timeReducer from './time/reducers'

const rootReducer = combineReducers({
  time: timeReducer,
  [paths.dataPath]: coreReducers.data,
  [paths.walletPath]: coreReducers.wallet,
  [paths.settingsPath]: coreReducers.settings,
  [paths.walletOptionsPath]: coreReducers.walletOptions,
  [paths.kvStorePath]: coreReducers.kvStore,
})
console.log('hey im the rootReducer', rootReducer)

export default rootReducer