
import { combineReducers } from 'redux'
import settings from 'config'
import { reducer as reduxUiReducer } from 'redux-ui'
import { reducer as formReducer } from 'redux-form'
import { coreReducers } from 'blockchain-wallet-v4/src'
import alertsReducer from './Alerts/reducers.js'
import authReducer from './Auth/reducers.js'
import goalsReducer from './Goals/reducers.js'
import modalsReducer from './Modals/reducers.js'
import preferencesReducer from './Preferences/reducers.js'
import scrollReducer from './Scroll/reducers.js'
import sessionReducer from './Session/reducers.js'
import wizardReducer from './Wizard/reducers.js'

const rootReducer = combineReducers({
  alerts: alertsReducer,
  auth: authReducer,
  form: formReducer,
  goals: goalsReducer,
  modals: modalsReducer,
  preferences: preferencesReducer,
  scroll: scrollReducer,
  session: sessionReducer,
  ui: reduxUiReducer,
  wizard: wizardReducer,
  [settings.WALLET_DATA_PATH]: coreReducers.data,
  [settings.WALLET_PAYLOAD_PATH]: coreReducers.wallet,
  [settings.WALLET_SETTINGS_PATH]: coreReducers.settings,
  [settings.WALLET_OPTIONS_PATH]: coreReducers.walletOptions
})

export default rootReducer
