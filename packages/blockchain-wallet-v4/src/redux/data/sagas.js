import { bitcoin } from './bitcoin/sagas.js'
import { ethereum } from './ethereum/sagas.js'
import { bch } from './bch/sagas.js'
import { misc } from './misc/sagas.js'
import { shapeShift } from './shapeShift/sagas.js'

export const dataSagasFactory = ({ api, socket } = {}) => ({
  bitcoin: bitcoin({ api, socket }),
  ethereum: ethereum({ api, socket }),
  bch: bch({ api, socket }),
  misc: misc({ api, socket }),
  shapeShift: shapeShift({ api, socket })
})
