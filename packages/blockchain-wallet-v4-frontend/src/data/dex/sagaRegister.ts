import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const dexSagas = sagas({ api })

  return function* dexSaga() {
    yield takeLatest(actions.fetchChains.type, dexSagas.fetchChains)
    yield takeLatest(actions.fetchChainTopTokens.type, dexSagas.fetchChainTopTokens)
  }
}
