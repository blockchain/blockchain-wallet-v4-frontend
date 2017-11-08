import config from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import * as auth from './auth/sagas.js'
import * as data from './data/sagas.js'
import * as paymentBitcoin from './payment/bitcoin/sagas.js'
import * as paymentEthereum from './payment/ethereum/sagas.js'
import * as settings from './settings/sagas.js'
import * as wallet from './wallet/sagas.js'

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

const payment = {
  bitcoin: paymentBitcoin,
  ethereum: paymentEthereum
}

export {
  auth,
  core,
  data,
  payment,
  settings,
  wallet
}
