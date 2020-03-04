import * as A from './actions'
import { APIType } from 'core/network/api'
import { call, put } from 'redux-saga/effects'
import { FiatEligibleType } from 'core/types'

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
  const fetchSBFiatEligible = function * ({
    currency
  }: ReturnType<typeof A.fetchSBFiatEligible>) {
    try {
      yield put(A.fetchSBFiatEligibleLoading())
      const fiatEligible: FiatEligibleType = yield call(
        api.getSBFiatEligible,
        currency
      )
      yield put(A.fetchSBFiatEligibleSuccess(fiatEligible))
    } catch (e) {
      yield put(A.fetchSBFiatEligibleFailure(e))
    }
  }

  const fetchSBPairs = function * ({
    currency
  }: ReturnType<typeof A.fetchSBPairs>) {
    try {
      yield put(A.fetchSBPairsLoading())
      const { pairs } = yield call(api.getSBPairs, currency)
      yield put(A.fetchSBPairsSuccess(pairs))
    } catch (e) {
      yield put(A.fetchSBPairsFailure(e))
    }
  }

  return {
    fetchSBPairs,
    fetchSBFiatEligible
  }
}
