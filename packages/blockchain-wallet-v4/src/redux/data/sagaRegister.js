import { fork } from 'redux-saga/effects'
import bitcoin from './bitcoin/sagaRegister'
import ethereum from './ethereum/sagaRegister'
import bch from './bch/sagaRegister'
import misc from './misc/sagaRegister'
import shapeShift from './shapeShift/sagaRegister'
import sfox from './sfox/sagaRegister'
import coinify from './coinify/sagaRegister'

export default ({ api }) => function * () {
  yield fork(bitcoin({ api }))
  yield fork(coinify({ api }))
  yield fork(ethereum({ api }))
  yield fork(bch({ api }))
  yield fork(misc({ api }))
  yield fork(shapeShift({ api }))
  yield fork(sfox({ api }))
}
