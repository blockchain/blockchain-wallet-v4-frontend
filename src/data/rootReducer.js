import { combineReducers } from 'redux'
import settings from 'config'
import { walletReducer, blockchainDataReducer } from 'dream-wallet/lib/redux/reducers'
import activityReducer from './Activity/reducers.js'
import authReducer from './Auth/reducers.js'
import uiReducer from './UI/reducers.js'
import logReducer from './Log/reducers.js'

const rootReducer = combineReducers({
  applicationState: combineReducers({
    activities: activityReducer,
    auth: authReducer.login,
    ui: uiReducer,
    log: logReducer
    // whatsNew: whatsNewReducer
  }),
  session: authReducer.session,
  [settings.BLOCKCHAIN_DATA_PATH]: blockchainDataReducer,
  [settings.WALLET_IMMUTABLE_PATH]: walletReducer
})

export default rootReducer
