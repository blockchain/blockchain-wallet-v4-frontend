
import { combineReducers } from 'redux'
import settings from 'config'
import { reducer as reduxUiReducer } from 'redux-ui'
import { reducer as formReducer } from 'redux-form'
import { coreReducers } from 'blockchain-wallet-v4/src'
import alertsReducer from './alerts/reducers'
import authReducer from './auth/reducers'
import goalsReducer from './goals/reducers'
import modalsReducer from './modals/reducers'
import preferencesReducer from './preferences/reducers'
import scrollReducer from './scroll/reducers'
import sessionReducer from './session/reducers'
import wizardReducer from './wizard/reducers'

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
  [settings.WALLET_OPTIONS_PATH]: coreReducers.walletOptions,
  [settings.WALLET_KVSTORE_PATH]: coreReducers.kvStore
})

export default rootReducer
