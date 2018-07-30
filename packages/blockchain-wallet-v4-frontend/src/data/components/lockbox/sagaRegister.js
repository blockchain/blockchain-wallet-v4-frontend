import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const lockboxSagas = sagas({ api, coreSagas })

  return function*() {
    yield takeLatest(AT.DERIVE_CARBON_XPUBS, lockboxSagas.deriveCarbonXpubs)
  }
}
