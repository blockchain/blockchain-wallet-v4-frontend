import { takeEvery } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const { fetchExperimentsSaga } = sagas({ api, coreSagas, networks })

  return function* experimentsSaga() {
    yield takeEvery(actions.fetch.type, fetchExperimentsSaga)
  }
}
