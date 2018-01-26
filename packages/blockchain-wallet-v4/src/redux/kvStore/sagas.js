// import { whatsNew } from './whatsNew/sagas.js'
// import { ethereum } from './ethereum/sagas.js'
import { shapeShift } from './shapeShift/sagas.js'
import { buySell } from './buySell/sagas.js'
import { contacts } from './contacts/sagas.js'
import { root } from './root/sagas.js'

export const kvStoreSagasFactory = ({ api } = {}) => ({
  root: root({ api }),
  // whatsNew: whatsNew({ api }),
  // ethereum: ethereum({ api }),
  shapeShift: shapeShift({ api }),
  buySell: buySell({ api }),
  contacts: contacts({ api })
})
