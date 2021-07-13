import coins from './coins/sagas'
import rates from './rates/sagas'
import xlm from './xlm/sagas'

export default ({ api, coinsSocket, ratesSocket }) => ({
  xlm: xlm(),
  rates: rates({ api, ratesSocket }),
  sds: coins({ api, coinsSocket })
})
