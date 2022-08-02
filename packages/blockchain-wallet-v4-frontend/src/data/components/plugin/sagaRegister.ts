import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const pluginSagas = sagas({ api })

  return function* pluginSaga() {
    yield takeLatest(actions.getPublicAddress, pluginSagas.getPublicAddress)
    yield takeLatest(actions.getWallet, pluginSagas.getWallet)
  }
}
