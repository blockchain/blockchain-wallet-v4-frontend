import btc from './btc/sagas'
import bch from './bch/sagas'
// import eth from './eth/sagas'

export default ({ api }) => ({
  btc: btc({ api }),
  bch: bch({ api })
  // eth: eth({ api })
})
