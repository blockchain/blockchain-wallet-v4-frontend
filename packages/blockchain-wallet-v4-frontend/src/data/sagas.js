import config from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import * as auth from './auth/sagas'
import * as components from './components/sagas'
import * as data from './data/sagas'
import * as settings from './settings/sagas'
import * as wallet from './wallet/sagas'

const dataPath = config.WALLET_DATA_PATH
const settingsPath = config.WALLET_SETTINGS_PATH
const walletPath = config.WALLET_PAYLOAD_PATH
const walletOptionsPath = config.WALLET_OPTIONS_PATH
const kvStorePath = config.WALLET_KVSTORE_PATH

const core = coreSagasFactory({
  api,
  dataPath,
  walletPath,
  settingsPath,
  walletOptionsPath,
  kvStorePath,
  socket
})

export {
  auth,
  components,
  core,
  data,
  settings,
  wallet
}
