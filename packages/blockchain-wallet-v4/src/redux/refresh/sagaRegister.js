import { throttle } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const refreshSagas = sagas()

  return function * () {
    yield throttle(5000, AT.REFRESH, refreshSagas.refresh)
  }
}
