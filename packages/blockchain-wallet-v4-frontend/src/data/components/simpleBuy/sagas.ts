import * as A from './actions'
import * as S from './selectors'
import { actions } from 'data'
import { APIType } from 'core/network/api'
import { call, put, select } from 'redux-saga/effects'
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

  const initializeCheckout = function * ({
    pairs
  }: ReturnType<typeof A.initializeCheckout>) {
    try {
      const fiatCurrency = S.getFiatCurrency(yield select())
      if (!fiatCurrency) throw new Error('NO_FIAT_CURRENCY')
      yield put(A.fetchSBSuggestedAmountsLoading())
      const amounts = yield call(api.getSBSuggestedAmounts, fiatCurrency)
      yield put(A.fetchSBSuggestedAmountsSuccess(amounts))
      yield put(
        actions.form.initialize('simpleBuyCheckout', { pair: pairs[0] })
      )
    } catch (e) {
      yield put(A.fetchSBSuggestedAmountsFailure(e))
    }
  }

  return {
    fetchSBPairs,
    fetchSBFiatEligible,
    initializeCheckout
  }
}
