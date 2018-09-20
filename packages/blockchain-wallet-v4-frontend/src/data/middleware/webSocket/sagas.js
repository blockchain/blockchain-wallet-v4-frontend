import bch from './bch/sagas'
import btc from './btc/sagas'
import eth from './eth/sagas'
import rates from './rates/sagas'

export default ({ api, bchSocket, btcSocket, ethSocket, ratesSocket }) => ({
  bch: bch({ api, bchSocket }),
  btc: btc({ api, btcSocket }),
  eth: eth({ api, ethSocket }),
  rates: rates({ api, ratesSocket })
})
