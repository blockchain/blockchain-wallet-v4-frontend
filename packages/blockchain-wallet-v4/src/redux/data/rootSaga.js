import bitcoin from './bitcoin/rootSaga'
import ethereum from './ethereum/rootSaga'
import bch from './bch/rootSaga'
import misc from './misc/rootSaga'
import shapeShift from './shapeShift/rootSaga'
import sfox from './sfox/rootSaga'
import coinify from './coinify/rootSaga'

export default ({ api }) => ({
  bitcoin: bitcoin({ api }),
  coinify: coinify({ api }),
  ethereum: ethereum({ api }),
  bch: bch({ api }),
  misc: misc({ api }),
  shapeShift: shapeShift({ api }),
  sfox: sfox({ api })
})
