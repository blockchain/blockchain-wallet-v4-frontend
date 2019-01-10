import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const { fetchVeriffUrl, syncVeriff } = sagas({ api })

  return function*() {
    yield takeLatest(AT.FETCH_VERIFF_URL, fetchVeriffUrl)
    yield takeLatest(AT.SYNC_VERIFF, syncVeriff)
  }
}
