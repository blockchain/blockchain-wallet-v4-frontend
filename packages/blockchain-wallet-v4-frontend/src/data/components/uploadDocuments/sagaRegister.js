import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const { fetchData, upload } = sagas({ api })

  return function * uploadDocumentsSaga() {
    yield takeLatest(AT.FETCH_DATA, fetchData)
    yield takeLatest(AT.UPLOAD, upload)
  }
}
