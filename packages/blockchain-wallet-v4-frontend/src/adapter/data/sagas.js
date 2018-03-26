import { fork } from 'redux-saga/effects'
import bchSaga from './bch/sagas'
import btcSaga from './btc/sagas'
import ethSaga from './eth/sagas'
import miscSaga from './misc/sagas'
import shapeshiftSaga from './shapeshift/sagas'

export default function * () {

  yield fork(bchSaga)
  yield fork(btcSaga)
  yield fork(ethSaga)
  yield fork(miscSaga)
  yield fork(shapeshiftSaga)
}
