import { bitcoin } from './bitcoin/sagas.js'
import { ethereum } from './ethereum/sagas.js'
import { bch } from './bch/sagas.js'
import { misc } from './misc/sagas.js'
import { shapeShift } from './shapeShift/sagas.js'
import { sfoxSaga } from './sfox/sagas.js'
import { coinifySaga } from './coinify/sagas.js'

export const dataSagasFactory = ({ api, socket, sfoxService, coinifyService } = {}) => ({
  bitcoin: bitcoin({ api, socket }),
  coinify: coinifySaga({ api, socket, coinifyService }),
  ethereum: ethereum({ api, socket }),
  bch: bch({ api, socket }),
  misc: misc({ api, socket }),
  shapeShift: shapeShift({ api, socket }),
  sfox: sfoxSaga({ api, socket, sfoxService })
})
