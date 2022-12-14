import { takeEvery } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const { fetchExperimentsSaga } = sagas({ api })

  return function* experimentsSaga() {
    yield takeEvery(actions.fetch.type, fetchExperimentsSaga)
  }
}
