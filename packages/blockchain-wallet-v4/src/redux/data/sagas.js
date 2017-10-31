import { bitcoin } from './bitcoin/sagas.js'
import { ethereum } from './ethereum/sagas.js'
import { misc } from './misc/sagas.js'

export const dataSagasFactory = ({ api, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket } = {}) => ({
  bitcoin: bitcoin({ api, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  ethereum: ethereum({ api, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  misc: misc({ api, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket })
})
