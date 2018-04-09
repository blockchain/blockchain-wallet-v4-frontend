import bitcoin from './bitcoin/sagas.js'
import ethereum from './ethereum/sagas.js'
import bch from './bch/sagas.js'
import misc from './misc/sagas.js'
import shapeShift from './shapeShift/sagas.js'
import sfox from './sfox/sagas.js'
import coinify from './coinify/sagas.js'

export default ({ api }) => ({
  bitcoin: bitcoin({ api }),
  coinify: coinify({ api }),
  ethereum: ethereum({ api }),
  bch: bch({ api }),
  misc: misc({ api }),
  shapeShift: shapeShift({ api }),
  sfox: sfox({ api })
})
