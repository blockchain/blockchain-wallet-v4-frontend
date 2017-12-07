import { bitcoin } from './bitcoin/sagas.js'
import { ethereum } from './ethereum/sagas.js'

export const commonSagasFactory = ({ api, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket } = {}) => ({
  bitcoin: bitcoin({ api, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  ethereum: ethereum({ api, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket })
})
