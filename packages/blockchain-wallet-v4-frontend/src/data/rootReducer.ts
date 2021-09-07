import { combineReducers } from 'redux'

import { coreReducers, paths } from 'blockchain-wallet-v4/src'

import { alertsReducer as alerts } from './alerts/slice'
import { analyticsReducer as analytics } from './analytics/slice'
import { authReducer as auth } from './auth/slice'
import { cacheReducer as cache } from './cache/slice'
import components from './components/reducers'
import { custodialReducer as custodial } from './custodial/reducers'
import form from './form/reducers'
import { goalsReducer as goals } from './goals/slice'
import { logsReducer as logs } from './logs/slice.js'
import { modalsReducer } from './modals/reducers'
import profile from './modules/profile/reducers'
import rates from './modules/rates/reducers'
import securityCenter from './modules/settings/reducers'
import { transferEthReducer } from './modules/transferEth/reducers'
import { preferencesReducer } from './preferences/reducers'
import { pricesReducer as prices } from './prices/slice'
import { sessionReducer as session } from './session/slice'

const rootReducer = {
  alerts,
  analytics,
  auth,
  cache,
  components,
  custodial,
  form,
  goals,
  logs,
  modals: modalsReducer,
  preferences: preferencesReducer,
  prices,
  profile,
  rates,
  securityCenter,
  session,
  transferEth: transferEthReducer,
  [paths.dataPath]: coreReducers.data,
  [paths.walletPath]: coreReducers.wallet,
  [paths.settingsPath]: coreReducers.settings,
  [paths.walletOptionsPath]: coreReducers.walletOptionsReducer,
  [paths.kvStorePath]: coreReducers.kvStore
}

const combinedReducer = combineReducers(rootReducer)
export type RootState = ReturnType<typeof combinedReducer>

export default rootReducer
