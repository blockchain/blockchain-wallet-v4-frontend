import { fork } from 'redux-saga/effects'

import bitcoin from './bitcoin/sagaRegister'
import ethereum from './ethereum/sagaRegister'
import bch from './bch/sagaRegister'
import misc from './misc/sagaRegister'
import shapeShift from './shapeShift/sagaRegister'
import sfox from './sfox/sagaRegister'
import coinify from './coinify/sagaRegister'

export default ({ api }) => function * () {
  fork(bitcoin({ api })),
  fork(coinify({ api })),
  fork(ethereum({ api })),
  fork(bch({ api })),
  fork(misc({ api })),
  fork(shapeShift({ api })),
  fork(sfox({ api }))
}
