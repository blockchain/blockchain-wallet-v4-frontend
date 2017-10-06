import settings from 'config'
import { coreSelectorsFactory } from 'blockchain-wallet-v4/src'
import * as alerts from './Alerts/selectors'
import * as auth from './Auth/selectors'
import * as charts from './Charts/selectors'
import * as modals from './Modals/selectors'
import * as preferences from './Preferences/selectors'
import * as scroll from './Scroll/selectors'
import * as wizard from './Wizard/selectors'

const core = coreSelectorsFactory({
  dataPath: settings.BLOCKCHAIN_DATA_PATH,
  settingsPath: settings.SETTINGS_PATH,
  walletPath: settings.WALLET_IMMUTABLE_PATH,
  walletOptionsPath: settings.WALLET_OPTIONS_PATH
})

export {
  alerts,
  auth,
  core,
  charts,
  modals,
  preferences,
  scroll,
  wizard
}
