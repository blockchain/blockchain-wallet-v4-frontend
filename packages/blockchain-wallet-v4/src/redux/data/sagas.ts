import bch from './bch/sagas'
import btc from './btc/sagas'
import coins from './coins/sagas'
import eth from './eth/sagas'
import fiat from './fiat/sagas'
import misc from './misc/sagas'
import xlm from './xlm/sagas'

export default ({ api, networks }) => ({
  bch: bch({ api }),
  btc: btc({ api }),
  coins: coins({ api }),
  eth: eth({ api }),
  fiat: fiat({ api }),
  misc: misc({ api }),
  xlm: xlm({ api, networks })
})
