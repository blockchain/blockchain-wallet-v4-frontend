import { call, put } from 'redux-saga/effects'

import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'

import profileSagas from '../modules/profile/sagas'
import * as A from './actions'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas; networks }) => {
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })

  const fetchBeneficiaries = function* () {
    try {
      yield put(A.fetchCustodialBeneficiariesLoading())

      const beneficiaries: ReturnType<typeof api.getBeneficiaries> = yield call(
        api.getBeneficiaries
      )

      yield put(A.fetchCustodialBeneficiariesSuccess(beneficiaries))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchCustodialBeneficiariesFailure(error))
    }
  }

  // We don't get back what coins you have a pending balance for for swap.
  // So if you swap into a coin that you don't have a balance for yet,
  // we just won't show you, because we added logic to remove coins from home
  // and sidenav unless you have a balance.
  // This fetches recent transactions from the /unified endpoint, so we can
  // compare this to the list of currencies we _know_ you have a balance for.
  const fetchRecentSwapTxs = function* () {
    try {
      yield call(waitForUserData)
      yield put(A.fetchRecentSwapTxsLoading())
      const txs: ReturnType<typeof api.getUnifiedSwapTrades> = yield call(api.getUnifiedSwapTrades)
      yield put(A.fetchRecentSwapTxsSuccess(txs))
    } catch (e) {
      yield put(A.fetchRecentSwapTxsFailure())
    }
  }

  return {
    fetchBeneficiaries,
    fetchRecentSwapTxs
  }
}
