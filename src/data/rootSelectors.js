import settings from 'config'
import { coreSelectorsFactory } from 'dream-wallet/lib'
import activitySelectors from 'data/Activity/selectors'

const activity = activitySelectors
const core = coreSelectorsFactory({
  dataPath: settings.BLOCKCHAIN_DATA_PATH,
  settingsPath: settings.SETTINGS_PATH,
  walletPath: settings.WALLET_IMMUTABLE_PATH
})

export {
  core,
  activity
}
