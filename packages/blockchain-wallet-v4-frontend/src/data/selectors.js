import settings from 'config'
import { coreSelectorsFactory } from 'blockchain-wallet-v4/src'
import * as alerts from './alerts/selectors'
import * as application from './application/selectors'
import * as auth from './auth/selectors'
import * as goals from './goals/selectors'
import * as modals from './modals/selectors'
import * as preferences from './preferences/selectors'
import * as scroll from './scroll/selectors'
import * as session from './session/selectors'
import * as wizard from './wizard/selectors'

const core = coreSelectorsFactory({
  dataPath: settings.WALLET_DATA_PATH,
  kvStorePath: settings.WALLET_KVSTORE_PATH,
  settingsPath: settings.WALLET_SETTINGS_PATH,
  walletPath: settings.WALLET_PAYLOAD_PATH,
  walletOptionsPath: settings.WALLET_OPTIONS_PATH
})

export {
  alerts,
  application,
  auth,
  core,
  goals,
  modals,
  preferences,
  scroll,
  session,
  wizard
}
