import config from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import alerts from './Alerts/sagas.js'
import auth from './Auth/sagas.js'
import data from './Data/sagas.js'
import payment from './Payment/sagas.js'
import settings from './Settings/sagas.js'
import wallet from './Wallet/sagas.js'

const dataPath = config.BLOCKCHAIN_DATA_PATH
const settingsPath = config.SETTINGS_PATH
const walletPath = config.WALLET_IMMUTABLE_PATH

const core = coreSagasFactory({
  api,
  dataPath,
  walletPath,
  settingsPath,
  socket
})

export {
  core,
  alerts,
  auth,
  data,
  payment,
  settings,
  wallet
}
