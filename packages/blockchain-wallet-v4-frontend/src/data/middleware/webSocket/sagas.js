import coins from './coins/sagas'
import xlm from './xlm/sagas'

export default ({ api, coinsSocket }) => ({
  sds: coins({ api, coinsSocket }),
  xlm: xlm()
})
