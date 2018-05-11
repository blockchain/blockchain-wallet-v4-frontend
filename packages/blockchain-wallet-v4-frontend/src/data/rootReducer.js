
import { combineReducers } from 'redux'
import { reducer as reduxUiReducer } from 'redux-ui'
import { coreReducers, paths } from 'blockchain-wallet-v4/src'
import componentsReducer from './components/reducers'
import formReducer from './form/reducers'
import alertsReducer from './alerts/reducers.js'
import authReducer from './auth/reducers.js'
import cacheReducer from './cache/reducers.js'
import coinifyReducer from './modules/coinify/reducers.js'
import goalsReducer from './goals/reducers.js'
import logsReducer from './logs/reducers'
import modalsReducer from './modals/reducers.js'
import preferencesReducer from './preferences/reducers.js'
import scrollReducer from './scroll/reducers.js'
import sessionReducer from './session/reducers.js'
import wizardReducer from './wizard/reducers.js'
import settingsReducer from './modules/settings/reducers.js'
import sfoxSignupReducer from './modules/sfox/reducers.js'
import qaReducer from './modules/qa/reducers.js'

const rootReducer = combineReducers({
  alerts: alertsReducer,
  auth: authReducer,
  coinify: coinifyReducer,
  components: componentsReducer,
  form: formReducer,
  goals: goalsReducer,
  modals: modalsReducer,
  logs: logsReducer,
  preferences: preferencesReducer,
  cache: cacheReducer,
  scroll: scrollReducer,
  session: sessionReducer,
  ui: reduxUiReducer,
  wizard: wizardReducer,
  securityCenter: settingsReducer,
  sfoxSignup: sfoxSignupReducer,
  qa: qaReducer,
  [paths.dataPath]: coreReducers.data,
  [paths.walletPath]: coreReducers.wallet,
  [paths.settingsPath]: coreReducers.settings,
  [paths.walletOptionsPath]: coreReducers.walletOptions,
  [paths.kvStorePath]: coreReducers.kvStore
})

export default rootReducer
