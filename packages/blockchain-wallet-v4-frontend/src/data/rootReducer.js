
import { combineReducers } from 'redux'
import settings from 'config'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxUiReducer } from 'redux-ui'
import { reducer as formReducer } from 'redux-form'
import { coreReducers } from 'blockchain-wallet-v4/src'
import alertsReducer from './Alerts/reducers.js'
import authReducer from './Auth/reducers.js'
import modalsReducer from './Modals/reducers.js'
import preferencesReducer from './Preferences/reducers.js'
import scrollReducer from './Scroll/reducers.js'
import sessionReducer from './Session/reducers.js'
import wizardReducer from './Wizard/reducers.js'

const rootReducer = combineReducers({
  application: combineReducers({
    alerts: alertsReducer,
    auth: authReducer,
    modals: modalsReducer,
    scroll: scrollReducer,
    wizard: wizardReducer
  }),
  ui: reduxUiReducer,
  form: formReducer,
  preferences: preferencesReducer,
  router: routerReducer,
  session: sessionReducer,
  [settings.BLOCKCHAIN_DATA_PATH]: coreReducers.data,
  [settings.WALLET_IMMUTABLE_PATH]: coreReducers.wallet,
  [settings.SETTINGS_PATH]: coreReducers.settings,
  [settings.WALLET_OPTIONS_PATH]: coreReducers.walletOptions
})

export default rootReducer
