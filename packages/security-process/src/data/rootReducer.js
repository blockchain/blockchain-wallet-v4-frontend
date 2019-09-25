import { coreReducers, paths } from 'blockchain-wallet-v4/src'
import alertsReducer from './alerts/reducers'
import analyticsReducer from './analytics/reducers'
import authReducer from './auth/reducers'
import formReducer from './form/reducers'
import cacheReducer from './cache/reducers'
import goalsReducer from './goals/reducers'
import logsReducer from './logs/reducers'
import modalsReducer from './modals/reducers'
import preferencesReducer from './preferences/reducers'
import profileReducer from './modules/profile/reducers'
import sessionReducer from './session/reducers'
import wizardReducer from './wizard/reducers'
import settingsReducer from './modules/settings/reducers'

const rootReducer = {
  alerts: alertsReducer,
  analytics: analyticsReducer,
  auth: authReducer,
  form: formReducer,
  goals: goalsReducer,
  modals: modalsReducer,
  logs: logsReducer,
  preferences: preferencesReducer,
  profile: profileReducer,
  cache: cacheReducer,
  session: sessionReducer,
  wizard: wizardReducer,
  securityCenter: settingsReducer,
  [paths.dataPath]: coreReducers.data,
  [paths.walletPath]: coreReducers.wallet,
  [paths.settingsPath]: coreReducers.settings,
  [paths.walletOptionsPath]: coreReducers.walletOptions,
  [paths.kvStorePath]: coreReducers.kvStore
}

export default rootReducer
