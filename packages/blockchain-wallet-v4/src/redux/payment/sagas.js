import btc from './btc/sagas'
import bch from './bch/sagas'
import bsv from './bsv/sagas'
import eth from './eth/sagas'
import xlm from './xlm/sagas'

export default ({ api }) => ({
  btc: btc({ api }),
  bch: bch({ api }),
  bsv: bsv({ api }),
  eth: eth({ api }),
  xlm: xlm({ api })
})
