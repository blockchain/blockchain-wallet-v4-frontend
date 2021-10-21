import bch from './bch/sagas'
import btc from './btc/sagas'
import eth from './eth/sagas'
import xlm from './xlm/sagas'

export default ({ api }) => ({
  bch: bch({ api }),
  btc: btc({ api }),
  eth: eth({ api }),
  xlm: xlm({ api })
})
