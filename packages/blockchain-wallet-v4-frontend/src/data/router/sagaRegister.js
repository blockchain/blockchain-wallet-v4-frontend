import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'

export default () => {
  const routerSagas = sagas()

  return function * routerSaga() {
    yield takeLatest('@@router/LOCATION_CHANGE', routerSagas.changeLocation)
  }
}
