import bch from './bch/sagas'
import btc from './btc/sagas'
import eth from './eth/sagas'

export default ({ api, bchSocket, btcSocket, ethSocket }) => ({
  bch: bch({ api, bchSocket }),
  btc: btc({ api, btcSocket }),
  eth: eth({ api, ethSocket })
})
