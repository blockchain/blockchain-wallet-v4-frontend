import { call, put } from 'redux-saga/effects'

import profileSagas from 'data/modules/profile/sagas'

import { actions as A } from './slice'

export default ({ api, coreSagas, networks }) => {
  const { waitForUserData } = profileSagas({
    api,
    coreSagas,
    networks
  })

  const fetchExperimentsSaga = function* () {
    try {
      yield put(A.fetchLoading())
      yield call(waitForUserData)
      const experiements: ReturnType<typeof api.getExperiments> = yield call(api.getExperiments)

      yield put(A.fetchSuccess(experiements))
    } catch (error) {
      // const error = errorHandler(e)
      yield put(A.fetchFailure(error))
    }
  }

  return { fetchExperimentsSaga }
}
