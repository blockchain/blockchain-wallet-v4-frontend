import xlm from './xlm/sagas'
import rates from './rates/sagas'
import sds from './socketd/sagas'

export default ({ api, ratesSocket, socketd }) => ({
  xlm: xlm(),
  rates: rates({ api, ratesSocket }),
  sds: sds({ api, socketd })
})
