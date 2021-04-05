import bch from './bch/sagas'
import btc from './btc/sagas'
import eth from './eth/sagas'
import lockbox from './lockbox/sagas'
import root from './root/sagas'
import userCredentials from './userCredentials/sagas'
import walletCredentials from './walletCredentials/sagas'
import xlm from './xlm/sagas'

export default ({ api, networks }) => ({
  bch: bch({ api, networks }),
  btc: btc({ api, networks }),
  eth: eth({ api, networks }),
  lockbox: lockbox({ api, networks }),
  root: root({ api, networks }),
  userCredentials: userCredentials({ api, networks }),
  xlm: xlm({ api, networks }),
  walletCredentials: walletCredentials({ api, networks })
})
