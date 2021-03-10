import { call, put } from 'redux-saga/effects'

import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'

import * as A from './actions'

export default ({ api }: { api: APIType }) => {
  const fetchBeneficiaries = function * () {
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

  return {
    fetchBeneficiaries
  }
}
