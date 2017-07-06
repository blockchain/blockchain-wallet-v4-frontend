
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import settings from 'config'
import { reducer as formReducer } from 'redux-form'
import { coreReducers } from 'dream-wallet/lib'
import activityReducer from './Activity/reducers.js'
import alertsReducer from './Alerts/reducers'
import authReducer from './Auth/reducers.js'
import logReducer from './Log/reducers.js'
import modalsReducer from './Modals/reducers.js'
import preferencesReducer from './Preferences/reducers.js'
import uiReducer from './UI/reducers.js'

const rootReducer = combineReducers({
  applicationState: combineReducers({
    activities: activityReducer,
    alerts: alertsReducer,
    auth: authReducer.login,
    log: logReducer,
    modals: modalsReducer,
    ui: uiReducer
  }),
  form: formReducer,
  preferences: preferencesReducer,
  router: routerReducer,
  session: authReducer.session,
  [settings.BLOCKCHAIN_DATA_PATH]: coreReducers.data,
  [settings.WALLET_IMMUTABLE_PATH]: coreReducers.wallet,
  [settings.SETTINGS_PATH]: coreReducers.settings

})

export default rootReducer
