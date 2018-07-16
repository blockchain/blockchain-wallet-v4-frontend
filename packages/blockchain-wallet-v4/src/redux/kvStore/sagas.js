// import whatsNew from './whatsNew/sagas'
import bch from './bch/sagas'
import ethereum from './ethereum/sagas'
import shapeShift from './shapeShift/sagas'
import buySell from './buySell/sagas'
import contacts from './contacts/sagas'
import root from './root/sagas'

export default ({ api }) => ({
  root: root({ api }),
  // whatsNew: whatsNew({ api }),
  bch: bch({ api }),
  ethereum: ethereum({ api }),
  shapeShift: shapeShift({ api }),
  buySell: buySell({ api }),
  contacts: contacts({ api })
})
