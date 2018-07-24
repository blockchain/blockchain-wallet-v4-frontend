import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default () => {
  const routerSagas = sagas()
  return function * () {
    yield takeLatest('@@router/LOCATION_CHANGE', routerSagas.changeLocation)
  }
}
