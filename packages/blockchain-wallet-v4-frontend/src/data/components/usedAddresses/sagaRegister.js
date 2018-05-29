import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const usedAddressesSagas = sagas({ api, coreSagas })

  return function * () {
    yield takeLatest(AT.FETCH_USED_ADDRESSES, usedAddressesSagas.fetchUsedAddresses)
    yield takeLatest(AT.TOGGLE_USED_ADDRESSES, usedAddressesSagas.toggleUsedAddresses)
  }
}
