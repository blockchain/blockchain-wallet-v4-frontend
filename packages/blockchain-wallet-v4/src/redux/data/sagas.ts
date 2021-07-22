import algo from './algo/sagas'
import bch from './bch/sagas'
import btc from './btc/sagas'
import clout from './clout/sagas'
import doge from './doge/sagas'
import dot from './dot/sagas'
import eth from './eth/sagas'
import fiat from './fiat/sagas'
import stx from './stx/sagas'
import xlm from './xlm/sagas'

export default ({ api, networks }) => ({
  algo: algo({ api }),
  bch: bch({ api }),
  btc: btc({ api }),
  clout: clout({ api }),
  doge: doge({ api }),
  dot: dot({ api }),
  eth: eth({ api }),
  fiat: fiat({ api }),
  stx: stx(),
  xlm: xlm({ api, networks })
})
