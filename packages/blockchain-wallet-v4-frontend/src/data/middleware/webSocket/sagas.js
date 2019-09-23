import xlm from './xlm/sagas'
import rates from './rates/sagas'
import coins from './coins/sagas'

export default ({ api, ratesSocket, coinsSocket }) => ({
  xlm: xlm(),
  rates: rates({ api, ratesSocket }),
  sds: coins({ api, coinsSocket })
})
