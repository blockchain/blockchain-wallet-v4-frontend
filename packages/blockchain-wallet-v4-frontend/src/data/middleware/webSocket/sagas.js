import activities from './activities/sagas'
import coins from './coins/sagas'
import rates from './rates/sagas'
import xlm from './xlm/sagas'

export default ({ activitiesSocket, api, coinsSocket, ratesSocket }) => ({
  activities: activities({ activitiesSocket, api }),
  rates: rates({ api, ratesSocket }),
  sds: coins({ api, coinsSocket }),
  xlm: xlm()
})
