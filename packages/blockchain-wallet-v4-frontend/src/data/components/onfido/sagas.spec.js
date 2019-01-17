import { select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { actions, model } from 'data'
import * as A from './actions'
import * as S from './selectors'
import sagas from './sagas'
const api = {
  syncOnfido: jest.fn()
}
const { syncOnfido } = sagas({ api })
const { COMPLETE } = model.analytics.KYC
const isSelfie = true
const applicantId = '12312312asdAWeqwq23-21d13d3d2'
const action = {
  payload: {
    isSelfie
  }
}
describe('syncOnfido', () => {
  it('should sync with backend, redirect user to the exchange and log kyc complete event', () => {
    return expectSaga(syncOnfido, action)
      .provide([[select(S.getApplicantId), applicantId]])
      .put(A.syncOnfidoLoading())
      .call(api.syncOnfido, applicantId, isSelfie)
      .put(A.syncOnfidoSuccess())
      .put(actions.modules.profile.fetchUser())
      .put(actions.modals.closeAllModals())
      .put(actions.router.push('/swap'))
      .put(actions.analytics.logEvent(COMPLETE))
      .run()
  })
  it('should save error state if sync fails', () => {
    const error = {}
    api.syncOnfido.mockRejectedValue(error)
    return expectSaga(syncOnfido, action)
      .provide([[select(S.getApplicantId), applicantId]])
      .put(A.syncOnfidoLoading())
      .call(api.syncOnfido, applicantId, isSelfie)
      .put(A.syncOnfidoError(error))
      .run()
  })
})
