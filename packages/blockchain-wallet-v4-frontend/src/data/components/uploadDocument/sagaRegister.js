import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const { upload } = sagas({ api })

  return function*() {
    yield takeLatest(AT.UPLOAD_DOCUMENT, upload)
  }
}
