import { combineReducers } from 'redux'

import { coreReducers, paths } from 'blockchain-wallet-v4/src'

import { alertsReducer } from './alerts/reducers'
import { analyticsReducer } from './analytics/reducers'
import authReducer from './auth/reducers'
import cacheReducer from './cache/reducers'
import componentsReducer from './components/reducers'
import { custodialReducer } from './custodial/reducers'
import formReducer from './form/reducers'
import { goalsReducer } from './goals/reducers'
import logsReducer from './logs/reducers'
import { modalsReducer } from './modals/reducers'
import profileReducer from './modules/profile/reducers'
import ratesReducer from './modules/rates/reducers'
import settingsReducer from './modules/settings/reducers'
import { transferEthReducer } from './modules/transferEth/reducers'
import { preferencesReducer } from './preferences/reducers'
import pricesReducer from './prices/reducers'
import sessionReducer from './session/reducers'
import wizardReducer from './wizard/reducers'

const rootReducer = {
  alerts: alertsReducer,
  analytics: analyticsReducer,
  auth: authReducer,
  components: componentsReducer,
  custodial: custodialReducer,
  form: formReducer,
  goals: goalsReducer,
  modals: modalsReducer,
  logs: logsReducer,
  preferences: preferencesReducer,
  prices: pricesReducer,
  profile: profileReducer,
  rates: ratesReducer,
  cache: cacheReducer,
  session: sessionReducer,
  wizard: wizardReducer,
  securityCenter: settingsReducer,
  transferEth: transferEthReducer,
  [paths.dataPath]: coreReducers.data,
  [paths.walletPath]: coreReducers.wallet,
  [paths.settingsPath]: coreReducers.settings,
  [paths.walletOptionsPath]: coreReducers.walletOptionsReducer,
  [paths.kvStorePath]: coreReducers.kvStore
}

const combinedReducer = combineReducers(rootReducer)
export type RootState = ReturnType<typeof combinedReducer>

type s = RootState['walletOptionsPath']

export default rootReducer
