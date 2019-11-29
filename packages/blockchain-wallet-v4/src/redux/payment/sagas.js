import btc from './btc/sagas'
import bch from './bch/sagas'
import eth from './eth/sagas'
import xlm from './xlm/sagas'

export default (...args) => ({
  btc: btc(...args),
  bch: bch(...args),
  eth: eth(...args),
  xlm: xlm(...args)
})
