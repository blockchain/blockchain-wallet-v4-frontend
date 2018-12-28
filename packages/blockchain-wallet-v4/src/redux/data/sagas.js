import bch from './bch/sagas'
import btc from './btc/sagas'
import bsv from './bsv/sagas'
import coinify from './coinify/sagas'
import eth from './eth/sagas'
import sfox from './sfox/sagas'
import shapeShift from './shapeShift/sagas'
import xlm from './xlm/sagas'

// TODO: rename exports as coin codes
export default ({ api, options, networks }) => ({
  bch: bch({ api }),
  bitcoin: btc({ api }),
  bsv: bsv({ api }),
  coinify: coinify({ api, options }),
  ethereum: eth({ api }),
  sfox: sfox({ api, options }),
  shapeShift: shapeShift({ api }),
  xlm: xlm({ api, networks })
})
