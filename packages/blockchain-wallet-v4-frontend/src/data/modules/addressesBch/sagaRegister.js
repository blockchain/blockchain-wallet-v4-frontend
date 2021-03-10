import { takeEvery } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas, networks }) => {
  const addressesBchSagas = sagas({ coreSagas, networks })

  return function * addressesBchSaga() {
    yield takeEvery(
      AT.EDIT_BCH_ACCOUNT_LABEL,
      addressesBchSagas.editBchAccountLabel
    )
    yield takeEvery(
      AT.SHOW_BCH_CHANGE_ADDRS,
      addressesBchSagas.showBchChangeAddrs
    )
  }
}
