import settings from 'config'
import { coreSelectorsFactory } from 'dream-wallet/lib'
import activitySelectors from 'data/Activity/selectors'
import * as uiSelectors from 'data/UI/selectors'
import * as authSelectors from 'data/Auth/selectors'

const activity = activitySelectors
const ui = uiSelectors
const auth = authSelectors

const core = coreSelectorsFactory({
  dataPath: settings.BLOCKCHAIN_DATA_PATH,
  settingsPath: settings.SETTINGS_PATH,
  walletPath: settings.WALLET_IMMUTABLE_PATH
})

export {
  activity,
  auth,
  core,
  ui
}
