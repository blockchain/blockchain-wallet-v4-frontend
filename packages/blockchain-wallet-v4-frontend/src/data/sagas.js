import config from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'

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
  core
}
