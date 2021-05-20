import { combineReducers } from 'redux'

import { coreReducers, paths } from 'blockchain-wallet-v4/src'

import { alertsReducer } from './alerts/reducers'
import { analyticsReducer } from './analytics/reducers'
import auth from './auth/reducers'
import cache from './cache/reducers'
import components from './components/reducers'
import { custodialReducer as custodial } from './custodial/reducers'
import form from './form/reducers'
import goals from './goals/reducers'
import logs from './logs/reducers'
import { modalsReducer } from './modals/reducers'
import profile from './modules/profile/reducers'
import rates from './modules/rates/reducers'
import securityCenter from './modules/settings/reducers'
import { transferEthReducer } from './modules/transferEth/reducers'
import { preferencesReducer } from './preferences/reducers'
import prices from './prices/reducers'
import session from './session/reducers'

const rootReducer = {
  alerts: alertsReducer,
  analytics: analyticsReducer,
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
