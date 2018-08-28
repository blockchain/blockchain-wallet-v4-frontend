import bch from './bch/sagas'
import btc from './btc/sagas'
import eth from './eth/sagas'
import root from './root/sagas'
import buySell from './buySell/sagas'
import whatsNew from './whatsNew/sagas'
import contacts from './contacts/sagas'
import userCredentials from './userCredentials/sagas'
import shapeShift from './shapeShift/sagas'

export default ({ api, networks }) => ({
  bch: bch({ api, networks }),
  btc: btc({ api, networks }),
  ethereum: eth({ api, networks }),
  root: root({ api, networks }),
  buySell: buySell({ api, networks }),
  whatsNew: whatsNew({ api, networks }),
  contacts: contacts({ api, networks }),
  shapeShift: shapeShift({ api, networks }),
  userCredentials: userCredentials({ api, networks })
})
