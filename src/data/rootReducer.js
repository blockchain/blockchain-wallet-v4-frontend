import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import settings from 'config'
import { coreReducers } from 'dream-wallet/lib'
import activityReducer from './Activity/reducers.js'
import authReducer from './Auth/reducers.js'
import logReducer from './Log/reducers.js'
import preferencesReducer from './Preferences/reducers.js'
import uiReducer from './UI/reducers.js'

const rootReducer = combineReducers({
  applicationState: combineReducers({
    activities: activityReducer,
    auth: authReducer.login,
    ui: uiReducer,
    log: logReducer
    // whatsNew: whatsNewReducer
  }),
  preferences: preferencesReducer,
  session: authReducer.session,
  [settings.BLOCKCHAIN_DATA_PATH]: coreReducers.data,
  [settings.WALLET_IMMUTABLE_PATH]: coreReducers.wallet,
  [settings.SETTINGS_PATH]: coreReducers.settings,
  router: routerReducer
})

export default rootReducer
