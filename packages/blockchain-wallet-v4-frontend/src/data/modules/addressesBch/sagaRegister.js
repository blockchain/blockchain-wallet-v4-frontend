import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const addressesBchSagas = sagas({ coreSagas })

  return function * () {
    yield takeEvery(AT.EDIT_BCH_HD_LABEL, addressesBchSagas.editBchHdLabel)
    yield takeEvery(AT.EDIT_BCH_ACCOUNT_LABEL, addressesBchSagas.editBchAccountLabel)
  }
}
