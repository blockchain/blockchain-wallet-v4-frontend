
import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const walletSagas = sagas({ api })

  return function * () {
    yield takeLatest(AT.SET_ADDRESS_ARCHIVED, walletSagas.refetchContextData)
    yield takeLatest(AT.SET_ACCOUNT_ARCHIVED, walletSagas.refetchContextData)
  }
}
