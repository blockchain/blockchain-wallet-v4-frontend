// import whatsNew from './whatsNew/rootSaga'
import ethereum from './ethereum/rootSaga'
import bch from './bch/rootSaga'
import shapeShift from './shapeShift/rootSaga'
import buySell from './buySell/rootSaga'
import contacts from './contacts/rootSaga'
import root from './root/rootSaga'

export default ({ api }) => ({
  root: root({ api }),
  // whatsNew: whatsNew({ api }),
  ethereum: ethereum({ api }),
  bch: bch({ api }),
  shapeShift: shapeShift({ api }),
  buySell: buySell({ api }),
  contacts: contacts({ api })
})
