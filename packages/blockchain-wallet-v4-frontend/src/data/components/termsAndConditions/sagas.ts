import { call, put } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'

import { actions as A } from './slice'

export default ({ api }: { api: APIType }) => {
  const fetchTermsAndConditions = function* () {
    try {
      yield put(A.fetchTermsAndConditionsLoading())
      const termsAndConditions: ReturnType<typeof api.getUserTermsAndConditions> = yield call(
        api.getUserTermsAndConditions
      )
      yield put(A.fetchTermsAndConditionsSuccess(termsAndConditions))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchTermsAndConditionsFailure(error))
    }
  }
  const signTermsAndConditions = function* () {
    try {
      yield call(api.signUserTermsAndConditionsLast)
    } catch (e) {
      // do nothing
    }
  }

  return {
    fetchTermsAndConditions,
    signTermsAndConditions
  }
}
