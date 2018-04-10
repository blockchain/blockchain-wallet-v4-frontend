// import whatsNew from './whatsNew/sagas'
// import ethereum from './ethereum/sagas'
// import bch from './bch/sagas'
import shapeShift from './shapeShift/sagas'
import buySell from './buySell/sagas'
import contacts from './contacts/sagas'
import root from './root/sagas'

export default ({ api }) => ({
  root: root({ api }),
  // whatsNew: whatsNew({ api }),
  // ethereum: ethereum({ api }),
  // bch: bch({ api }),
  shapeShift: shapeShift({ api }),
  buySell: buySell({ api }),
  contacts: contacts({ api })
})
