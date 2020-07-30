import { APIType } from 'core/network/api'
import { call, put } from 'redux-saga/effects'

import * as A from './actions'
import { errorHandler } from 'core/utils'

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
