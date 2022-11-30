import { call, put } from 'redux-saga/effects'

import { APIType } from '@core/network/api'

import { actions } from './slice'

export default ({ api }: { api: APIType }) => {
  const fetchNetworkConfig = function* () {
    try {
      yield put(actions.fetchNetworkConfigLoading())
      const data = yield call(api.getNetworkConfig)
      yield put(actions.fetchNetworkConfigSuccess(data))
    } catch (e) {
      yield put(actions.fetchNetworkConfigFailure())
    }
  }

  return {
    fetchNetworkConfig
  }
}
