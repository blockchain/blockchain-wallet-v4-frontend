import bch from './bch/sagas'
import btc from './btc/sagas'
import eth from './eth/sagas'
import root from './root/sagas'
import unifiedCredentials from './unifiedCredentials/sagas'
import userCredentials from './userCredentials/sagas'
import walletCredentials from './walletCredentials/sagas'
import xlm from './xlm/sagas'

export default ({ api, networks }) => ({
  bch: bch({ api, networks }),
  btc: btc({ api, networks }),
  eth: eth({ api, networks }),
  root: root({ api, networks }),
  unifiedCredentials: unifiedCredentials({ api, networks }),
  userCredentials: userCredentials({ api, networks }),
  walletCredentials: walletCredentials({ api, networks }),
  xlm: xlm({ api, networks })
})
