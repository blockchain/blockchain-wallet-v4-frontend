import settings from 'config'
import { coreSelectorsFactory } from 'dream-wallet/lib'
import activitySelectors from 'data/Activity/selectors'
import * as authSelectors from 'data/Auth/selectors'
import * as preferencesSelectors from 'data/Preferences/selectors'
import * as uiSelectors from 'data/UI/selectors'

const activity = activitySelectors
const auth = authSelectors
const preferences = preferencesSelectors
const ui = uiSelectors

const core = coreSelectorsFactory({
  dataPath: settings.BLOCKCHAIN_DATA_PATH,
  settingsPath: settings.SETTINGS_PATH,
  walletPath: settings.WALLET_IMMUTABLE_PATH
})

export {
  activity,
  auth,
  core,
  preferences,
  ui
}
