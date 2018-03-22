import { fork } from 'redux-saga/effects'
import miscSaga from './misc/sagas'
import bchSaga from './bch/sagas'
import btcSaga from './btc/sagas'
import ethSaga from './eth/sagas'

export default function * () {
  yield fork(miscSaga)
  yield fork(bchSaga)
  yield fork(btcSaga)
  yield fork(ethSaga)
}
