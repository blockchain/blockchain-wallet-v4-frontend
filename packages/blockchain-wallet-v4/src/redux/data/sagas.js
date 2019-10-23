import bch from './bch/sagas'
import btc from './btc/sagas.ts'
import coinify from './coinify/sagas'
import eth from './eth/sagas'
import sfox from './sfox/sagas'
import xlm from './xlm/sagas'

export default ({ api, options, networks, ...rest }) => ({
  bch: bch({ api }),
  btc: btc({ api, ...rest }),
  coinify: coinify({ api, options }),
  eth: eth({ api }),
  sfox: sfox({ api, options }),
  xlm: xlm({ api, networks })
})
