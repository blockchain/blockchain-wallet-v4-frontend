import { whatsNew } from './whatsNew/sagas.js'
import { ethereum } from './ethereum/sagas.js'
import { shapeShift } from './shapeShift/sagas.js'
import { buySell } from './buySell/sagas.js'
import { contacts } from './contacts/sagas.js'

export const kvStoreSagasFactory = ({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket } = {}) => ({
  whatsNew: whatsNew({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  ethereum: ethereum({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  shapeShift: shapeShift({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  buySell: buySell({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  contacts: contacts({ api, kvStoreApi, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket })

})
