import coins from './coins/sagas'
import rates from './rates/sagas'
import xlm from './xlm/sagas'

export default ({ api, coinsSocket, ratesSocket }) => ({
  rates: rates({ api, ratesSocket }),
  sds: coins({ api, coinsSocket }),
  xlm: xlm()
})
