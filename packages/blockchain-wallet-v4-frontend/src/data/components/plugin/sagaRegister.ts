import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const pluginSagas = sagas({ api, coreSagas, networks })

  return function* pluginSaga() {
    yield takeLatest(actions.getPublicAddress, pluginSagas.getPublicAddress)
    yield takeLatest(actions.getWallet, pluginSagas.getWallet)
    yield takeLatest(actions.autoLogin, pluginSagas.autoLogin)
  }
}
