import { coreReducers, paths } from 'blockchain-wallet-v4/src'
import componentsReducer from './components/reducers'
import formReducer from './form/reducers'
import alertsReducer from './alerts/reducers'
import authReducer from './auth/reducers'
import cacheReducer from './cache/reducers'
import goalsReducer from './goals/reducers'
import logsReducer from './logs/reducers'
import modalsReducer from './modals/reducers'
import preferencesReducer from './preferences/reducers'
import profileReducer from './modules/profile/reducers'
import ratesReducer from './modules/rates/reducers'
import sessionReducer from './session/reducers'
import wizardReducer from './wizard/reducers'
import settingsReducer from './modules/settings/reducers'
import sfoxSignupReducer from './modules/sfox/reducers'
import qaReducer from './modules/qa/reducers'

const rootReducer = {
  alerts: alertsReducer,
  auth: authReducer,
  components: componentsReducer,
  form: formReducer,
  goals: goalsReducer,
  modals: modalsReducer,
  logs: logsReducer,
  preferences: preferencesReducer,
  profile: profileReducer,
  rates: ratesReducer,
  cache: cacheReducer,
  session: sessionReducer,
  wizard: wizardReducer,
  securityCenter: settingsReducer,
  sfoxSignup: sfoxSignupReducer,
  qa: qaReducer,
  [paths.dataPath]: coreReducers.data,
  [paths.walletPath]: coreReducers.wallet,
  [paths.settingsPath]: coreReducers.settings,
  [paths.walletOptionsPath]: coreReducers.walletOptions,
  [paths.kvStorePath]: coreReducers.kvStore
}

export default rootReducer
