import bch from './bch/sagas'
import btc from './btc/sagas'
import buySell from './buySell/sagas'
import contacts from './contacts/sagas'
import eth from './eth/sagas'
import lockbox from './lockbox/sagas'
import root from './root/sagas'
import userCredentials from './userCredentials/sagas'
import whatsNew from './whatsNew/sagas'
import xlm from './xlm/sagas'

export default ({ api, networks }) => ({
  bch: bch({ api, networks }),
  btc: btc({ api, networks }),
  eth: eth({ api, networks }),
  root: root({ api, networks }),
  lockbox: lockbox({ api, networks }),
  buySell: buySell({ api, networks }),
  whatsNew: whatsNew({ api, networks }),
  contacts: contacts({ api, networks }),
  userCredentials: userCredentials({ api, networks }),
  xlm: xlm({ api, networks })
})
