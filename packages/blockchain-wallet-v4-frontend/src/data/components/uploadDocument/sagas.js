import { put, call } from 'redux-saga/effects'

import * as actions from '../../actions'
import * as A from './actions'
export const logLocation = 'components/identityVerification/sagas'

export default ({ api }) => {
  const upload = function*({ payload }) {
    try {
      const { files, token } = payload
      yield call(api.uploadDocument, token, files)
      yield put(A.setUploaded())
    } catch (error) {
      yield put(A.setUploaded())
      yield put(actions.alerts.displayError(error.description))
    }
  }

  return {
    upload
  }
}
