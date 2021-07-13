import { call, put } from 'redux-saga/effects'

import { actions } from 'data'

import * as A from './actions'
export const logLocation = 'components/identityVerification/sagas'

export default ({ api }) => {
  const fetchData = function * ({ payload }) {
    try {
      const { token } = payload
      const response = yield call(api.fetchUploadData, token)
      yield put(A.setData(response))
    } catch (error) {
      yield put(actions.alerts.displayError(error.description))
    }
  }

  const upload = function * ({ payload }) {
    try {
      const { files, redirectUrl, token } = payload
      yield put(A.setUploadedLoading())
      const response = yield call(api.uploadDocuments, token, files)
      yield put(A.setUploadedSuccess(response))
      yield put(A.setReference(response))
      if (redirectUrl) window.location = redirectUrl
      yield put(actions.router.push('/upload-document/success'))
    } catch (error) {
      yield put(A.setUploadedFailure(error.description))
      yield put(actions.alerts.displayError(error.description))
    }
  }

  return {
    fetchData,
    upload
  }
}
