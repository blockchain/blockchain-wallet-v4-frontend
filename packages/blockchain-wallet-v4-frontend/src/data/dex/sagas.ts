import { call, put } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { actions as A } from 'data/dex/slice'
import { DexChainList } from 'data/dex/types'

export default ({ api }: { api: APIType }) => {
  const fetchDexChains = function* () {
    try {
      yield put(A.fetchDexChainsLoading())
      const data: DexChainList = yield call(api.getDexChains)
      yield put(A.fetchDexChainsSuccess(data))
    } catch (e) {
      yield put(A.fetchDexChainsFailure(e.toString()))
    }
  }

  return {
    fetchDexChains
  }
}
