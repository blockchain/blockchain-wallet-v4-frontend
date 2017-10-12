import config from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import * as auth from './Auth/sagas.js'
import * as data from './Data/sagas.js'
import * as payment from './Payment/sagas.js'
import * as settings from './Settings/sagas.js'
import * as wallet from './Wallet/sagas.js'

const dataPath = config.WALLET_DATA_PATH
const settingsPath = config.WALLET_SETTINGS_PATH
const walletPath = config.WALLET_PAYLOAD_PATH
const walletOptionsPath = config.WALLET_OPTIONS_PATH

const core = coreSagasFactory({
  api,
  dataPath,
  walletPath,
  settingsPath,
  walletOptionsPath,
  socket
})

export {
  auth,
  core,
  data,
  payment,
  settings,
  wallet
}
