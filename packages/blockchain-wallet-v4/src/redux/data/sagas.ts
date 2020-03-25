import bch from './bch/sagas'
import btc from './btc/sagas'
import coinify from './coinify/sagas'
import eth from './eth/sagas'
import sfox from './sfox/sagas'
import stx from './stx/sagas'
import xlm from './xlm/sagas'

export default ({ api, options, networks }) => ({
  bch: bch({ api }),
  btc: btc({ api }),
  coinify: coinify({ api, options }),
  eth: eth({ api }),
  sfox: sfox({ api, options }),
  stx: stx(),
  xlm: xlm({ api, networks })
})
