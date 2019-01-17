import { select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'

import { actions, model } from 'data'
import * as A from './actions'
import * as S from './selectors'
import sagas from './sagas'

const url = 'https://magiv.veriff.me/123'
const applicantId = '1234'

const api = {
  fetchVeriffUrl: jest.fn(),
  syncVeriff: jest.fn()
}
const coreSagas = {}

api.fetchVeriffUrl.mockReturnValue({ data: { url }, applicantId })

const { fetchVeriffUrl, syncVeriff } = sagas({ api, coreSagas })

const { COMPLETE } = model.analytics.KYC

describe('fetchVeriffUrl', () => {
  it('should fetch veriff url, respecting loading states and set applicantId', () =>
    expectSaga(fetchVeriffUrl)
      .put(A.fetchVeriffUrlLoading())
      .call(api.fetchVeriffUrl)
      .put(A.setApplicantId(applicantId))
      .put(A.fetchVeriffUrlSuccess(url))
      .run())
  it('should set error if veriff fetch fails', () => {
    const error = {}
    api.fetchVeriffUrl.mockRejectedValue(error)
    return expectSaga(fetchVeriffUrl)
      .put(A.fetchVeriffUrlLoading())
      .call(api.fetchVeriffUrl)
      .put(A.fetchVeriffUrlError(error))
      .run()
  })
})

describe('syncVeriff', () => {
  it('should sync with applicant id, close all modals, redirect to exchange and log kyc complete event', () =>
    expectSaga(syncVeriff)
      .provide([[select(S.getApplicantId), applicantId]])
      .select(S.getApplicantId)
      .call(api.syncVeriff, applicantId)
      .put(actions.modals.closeAllModals())
      .put(actions.router.push('/swap'))
      .put(actions.analytics.logEvent(COMPLETE))
      .run())
})
