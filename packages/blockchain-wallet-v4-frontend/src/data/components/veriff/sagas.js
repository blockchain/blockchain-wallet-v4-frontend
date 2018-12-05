import { call, put, select } from 'redux-saga/effects'

import { actions, model } from 'data'
import * as A from './actions'
import * as S from './selectors'

export const logLocation = 'components/veriff/sagas'

export default ({ api }) => {
  const { COMPLETE } = model.analytics.KYC
  const fetchVeriffUrl = function*() {
    try {
      yield put(A.fetchVeriffUrlLoading())
      const { url, applicantId } = yield call(api.fetchVeriffUrl)
      yield put(A.setApplicantId(applicantId))
      yield put(A.fetchVeriffUrlSuccess(url))
    } catch (error) {
      yield put(A.fetchVeriffUrlError(error))
    }
  }

  const syncVeriff = function*() {
    const applicantId = yield select(S.getApplicantId)
    yield call(api.syncVeriff, applicantId)
    yield put(actions.modals.closeAllModals())
    yield put(actions.router.push('/exchange'))
    yield put(actions.analytics.logKycEvent(COMPLETE))
  }

  return {
    fetchVeriffUrl,
    syncVeriff
  }
}
