import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const routerSagas = sagas()

  return function* routerSaga() {
    yield takeLatest(AT.LOCATION_CHANGE, routerSagas.changeLocation)
  }
}
