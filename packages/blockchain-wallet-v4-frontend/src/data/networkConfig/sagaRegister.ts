import { put, takeLatest } from 'redux-saga/effects'

import { APIType } from '@core/network/api'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }: { api: APIType }) => {
  const networkConfigSagas = sagas({ api })

  return function* () {
    yield takeLatest(actions.fetchNetworkConfig, networkConfigSagas.fetchNetworkConfig)

    yield put(actions.fetchNetworkConfig())
  }
}
