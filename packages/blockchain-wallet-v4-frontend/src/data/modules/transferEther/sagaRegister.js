import { takeEvery, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const transferEtherSagas = sagas({ coreSagas })

  return function * () {
    yield takeEvery(AT.INIT_TRANSFER_ETHER, transferEtherSagas.initTransferEther)
    yield takeLatest(AT.TRANSFER_ETHER, transferEtherSagas.transferEther)
  }
}
