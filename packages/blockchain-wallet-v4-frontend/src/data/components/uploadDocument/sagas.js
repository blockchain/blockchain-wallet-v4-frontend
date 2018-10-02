import { put, call } from 'redux-saga/effects'

import * as A from './actions'

export const logLocation = 'components/identityVerification/sagas'

export default ({ api }) => {
  const upload = function*({ payload }) {
    try {
      const { file, token } = payload
      yield put(A.uploadLoading())
      yield call(api.uploadDocument, token, file)
      yield put(A.uploadSuccess())
    } catch (error) {
      yield put(A.uploadError(error))
    }
  }

  return {
    upload
  }
}
