import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const { fetchData, upload } = sagas({ api })

  return function* uploadDocumentsSaga() {
    yield takeLatest(actions.fetchData, fetchData)
    yield takeLatest(actions.upload, upload)
  }
}
