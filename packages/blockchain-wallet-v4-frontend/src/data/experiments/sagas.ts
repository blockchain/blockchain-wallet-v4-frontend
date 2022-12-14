import { call, put } from 'redux-saga/effects'

import { actions as A } from './slice'

export default ({ api }) => {
  const fetchExperimentsSaga = function* () {
    try {
      yield put(A.fetchLoading())
      const experiements: ReturnType<typeof api.getExperiments> = yield call(api.getExperiments)

      yield put(A.fetchSuccess(experiements))
    } catch (error) {
      // const error = errorHandler(e)
      yield put(A.fetchFailure(error))
    }
  }

  return { fetchExperimentsSaga }
}
