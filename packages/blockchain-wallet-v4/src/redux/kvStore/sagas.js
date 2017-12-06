import { whatsNew } from './whatsNew/sagas.js'
import { ethereum } from './ethereum/sagas.js'
import { shapeShift } from './shapeShift/sagas.js'
import { buySell } from './buySell/sagas.js'
import { contacts } from './contacts/sagas.js'
import { root } from './root/sagas.js'

export const kvStoreSagasFactory = ({ api, kvStorePath, walletPath } = {}) => ({
  root: root({ api, kvStorePath, walletPath }),
  whatsNew: whatsNew({ api, kvStorePath, walletPath }),
  ethereum: ethereum({ api, kvStorePath, walletPath }),
  shapeShift: shapeShift({ api, kvStorePath, walletPath }),
  buySell: buySell({ api, kvStorePath, walletPath }),
  contacts: contacts({ api, kvStorePath, walletPath })
})
