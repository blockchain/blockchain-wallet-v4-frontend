import { whatsNew } from './whatsNew/sagas.js'
import { ethereum } from './ethereum/sagas.js'

export const kvStoreSagasFactory = ({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket } = {}) => ({
  whatsNew: whatsNew({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  ethereum: ethereum({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket })

})
