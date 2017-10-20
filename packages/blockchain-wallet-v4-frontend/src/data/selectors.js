import settings from 'config'
import { coreSelectorsFactory } from 'blockchain-wallet-v4/src'
import * as alerts from './Alerts/selectors'
import * as auth from './Auth/selectors'
import * as goals from './Goals/selectors'
import * as modals from './Modals/selectors'
import * as preferences from './Preferences/selectors'
import * as scroll from './Scroll/selectors'
import * as session from './Session/selectors'
import * as wizard from './Wizard/selectors'

const core = coreSelectorsFactory({
  dataPath: settings.WALLET_DATA_PATH,
  kvStorePath: settings.WALLET_KVSTORE_PATH,
  settingsPath: settings.WALLET_SETTINGS_PATH,
  walletPath: settings.WALLET_PAYLOAD_PATH,
  walletOptionsPath: settings.WALLET_OPTIONS_PATH
})

export {
  alerts,
  auth,
  core,
  goals,
  modals,
  preferences,
  scroll,
  session,
  wizard
}
