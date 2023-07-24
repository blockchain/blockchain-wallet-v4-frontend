import { combineReducers } from 'redux'

import { coreReducers, paths } from '@core'

import { alertsReducer as alerts } from './alerts/slice'
import { authReducer as auth } from './auth/slice'
import { cacheReducer as cache } from './cache/slice'
import components from './components/reducers'
import { custodialReducer as custodial } from './custodial/slice'
import { experimentsReducer as experiments } from './experiments/slice'
import form from './form/reducers'
import { goalsReducer as goals } from './goals/slice'
import { logsReducer as logs } from './logs/slice'
import { miscReducer as misc } from './misc/slice'
import { modalReducer } from './modals/slice'
import profile from './modules/profile/reducers'
import rates from './modules/rates/reducers'
import securityCenter from './modules/settings/reducers'
import { transferEthReducer } from './modules/transferEth/reducers'
import { networkConfigReducer as networkConfig } from './networkConfig/slice'
import { preferencesReducer } from './preferences/reducers'
import { pricesReducer as prices } from './prices/slice'
import { remoteConfigReducer as remoteConfig } from './remoteConfig'
import { sessionReducer as session } from './session/slice'
import { signupReducer as signup } from './signup/slice'

const rootReducer = {
  alerts,
  auth,
  cache,
  components,
  custodial,
  experiments,
  form,
  goals,
  logs,
  misc,
  modals: modalReducer,
  networkConfig,
  preferences: preferencesReducer,
  prices,
  profile,
  rates,
  remoteConfig,
  securityCenter,
  session,
  signup,
  [paths.dataPath]: coreReducers.data,
  [paths.walletPath]: coreReducers.wallet,
  [paths.settingsPath]: coreReducers.settings,
  [paths.kvStorePath]: coreReducers.kvStore,
  transferEth: transferEthReducer,
  walletOptions: coreReducers.walletOptionsReducer
}

const combinedReducer = combineReducers(rootReducer)
export type RootState = ReturnType<typeof combinedReducer>

export default rootReducer
