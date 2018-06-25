import { takeLatest } from 'redux-saga/effects'
import * as AT from '../actionTypes'
import sagas from './sagas'

export default () => {
  const addressLabelSagas = sagas()

  return function * () {
    yield takeLatest(AT.wallet.REFRESH_WRAPPER, addressLabelSagas.generateAddressLabels)
    yield takeLatest(AT.wallet.SET_WRAPPER, addressLabelSagas.generateAddressLabels)
  }
}
