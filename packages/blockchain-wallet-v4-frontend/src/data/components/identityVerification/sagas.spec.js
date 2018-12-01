import { expectSaga, testSaga } from 'redux-saga-test-plan'

import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import * as A from './actions'
import { FLOW_TYPES } from './model'
import sagas, { wrongFlowTypeError } from './sagas'

const api = {
  fetchKycConfig: jest.fn(),
  sendDeeplink: jest.fn()
}

const coreSagas = {}

const {
  checkKycFlow,
  createRegisterUserCampaign,
  registerUserCampaign,
  verifyIdentity
} = sagas({ api, coreSagas })

describe('checkKycFlow saga', () => {
  it('should set flow type', () => {
    const flowType = FLOW_TYPES.LOW
    api.fetchKycConfig.mockResolvedValue({ flowType })
    return expectSaga(checkKycFlow)
      .put(A.setKycFlow(Remote.Loading))
      .call(api.fetchKycConfig)
      .put(A.setKycFlow(Remote.of(flowType)))
      .run()
  })

  it('should set wrong type error if type is not in FLOW_TYPES', () => {
    const flowType = FLOW_TYPES.LOW + '1'
    api.fetchKycConfig.mockResolvedValue({ flowType })
    return expectSaga(checkKycFlow)
      .put(A.setKycFlow(Remote.Loading))
      .call(api.fetchKycConfig)
      .put(A.setKycFlow(Remote.Failure(wrongFlowTypeError)))
      .run()
  })

  it('should set error if flow type endpoint rejects', () => {
    const error = {}
    api.fetchKycConfig.mockRejectedValue(error)
    return expectSaga(checkKycFlow)
      .put(A.setKycFlow(Remote.Loading))
      .call(api.fetchKycConfig)
      .put(A.setKycFlow(Remote.Failure(error)))
      .run()
  })
})

describe('createRegisterUserCampaign', () => {
  it('should return registerUserCampaign saga if user does not need verification', () => {
    const saga = testSaga(createRegisterUserCampaign, {
      payload: { needsIdVerification: false }
    })
    saga
      .next()
      .call(registerUserCampaign)
      .next()
      .isDone()
  })
  describe('should get user id if user needs verification', () => {
    const saga = testSaga(createRegisterUserCampaign, {
      payload: { needsIdVerification: true }
    })
    it('should get user creds', () => {
      saga.next().select(selectors.core.kvStore.userCredentials.getUserId)
    })
    it('should attempt to verify id', () => {
      saga.next(Remote.of(1234)).call(verifyIdentity)
    })
    it('should always register user campaign', () => {
      saga
        .next()
        .call(registerUserCampaign, true)
        .next()
        .isDone()
    })
  })
})
