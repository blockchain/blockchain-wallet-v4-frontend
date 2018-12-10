import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga-test-plan/matchers'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, model, selectors } from 'data'
import * as A from './actions'
import * as S from './selectors'
import { FLOW_TYPES, STEPS } from './model'
import sagas, { wrongFlowTypeError } from './sagas'

const api = {
  fetchKycConfig: jest.fn(),
  sendDeeplink: jest.fn()
}

const coreSagas = {}

const {
  createUser,
  checkKycFlow,
  createRegisterUserCampaign,
  goToNextStep,
  goToPrevStep,
  initializeVerification,
  initializeStep,
  registerUserCampaign,
  verifyIdentity
} = sagas({ api, coreSagas })

const { USER_ACTIVATION_STATES, TIERS } = model.profile
const { NONE, CREATED, ACTIVE } = USER_ACTIVATION_STATES

const { getUserActivationState, getUserData } = selectors.modules.profile

describe('initializeVerification saga', () => {
  it('should set default values: non-coinify kyc and "2" as desired tier', () =>
    expectSaga(initializeVerification, { payload: {} })
      .provide([[call.fn(initializeStep), jest.fn()]])
      .put(A.setCoinify(false))
      .put(A.setDesiredTier(2))
      .run())

  it("should define if it's coinify kyc, set desired tier, and determine initial step", () => {
    const isCoinify = true
    const desiredTier = TIERS[1]
    return expectSaga(initializeVerification, {
      payload: { isCoinify, desiredTier }
    })
      .provide([[call.fn(initializeStep), jest.fn()]])
      .put(A.setCoinify(isCoinify))
      .put(A.setDesiredTier(desiredTier))
      .call(initializeStep)
      .run()
  })
})

describe('initializeStep saga', () => {
  const steps = ['personal', 'mobile', 'verify']
  it('should initialize first of the steps by default', () =>
    expectSaga(initializeStep)
      .provide([
        [select(getUserActivationState), Remote.NotAsked],
        [select(getUserData), Remote.NotAsked],
        [select(S.getSteps), steps]
      ])
      .select(getUserActivationState)
      .select(getUserData)
      .select(S.getSteps)
      .put(A.setVerificationStep(steps[0]))
      .run())

  it('should initialize first of the steps if userState is NONE', () =>
    expectSaga(initializeStep)
      .provide([
        [select(getUserActivationState), Remote.of(NONE)],
        [select(getUserData), Remote.NotAsked],
        [select(S.getSteps), steps]
      ])
      .select(getUserActivationState)
      .select(getUserData)
      .select(S.getSteps)
      .put(A.setVerificationStep(steps[0]))
      .run())

  it('should initialize with verify step if userState is not NONE and mobileVerified is true', () =>
    expectSaga(initializeStep)
      .provide([
        [select(getUserActivationState), Remote.of(CREATED)],
        [select(getUserData), Remote.of({ mobileVerified: true })],
        [select(S.getSteps), steps]
      ])
      .select(getUserActivationState)
      .select(getUserData)
      .select(S.getSteps)
      .put(A.setVerificationStep(STEPS.verify))
      .run())

  it('should initialize mobile step if userState is CREATED and mobileVerified is false', () =>
    expectSaga(initializeStep)
      .provide([
        [select(getUserActivationState), Remote.of(CREATED)],
        [select(getUserData), Remote.of({ mobileVerified: false })],
        [select(S.getSteps), steps]
      ])
      .select(getUserActivationState)
      .select(getUserData)
      .select(S.getSteps)
      .put(A.setVerificationStep(STEPS.mobile))
      .run())

  it('should initialize verify step if userState is ACTIVE and mobileVerified is false', () =>
    expectSaga(initializeStep)
      .provide([
        [select(getUserActivationState), Remote.of(ACTIVE)],
        [select(getUserData), Remote.of({ mobileVerified: false })],
        [select(S.getSteps), steps]
      ])
      .select(getUserActivationState)
      .select(getUserData)
      .select(S.getSteps)
      .put(A.setVerificationStep(STEPS.verify))
      .run())
})

describe('goToPrevStep saga', () => {
  const steps = ['personal', 'mobile']
  it('should direct user to prev step if it is available', () =>
    expectSaga(goToPrevStep)
      .provide([
        [select(S.getVerificationStep), steps[1]],
        [select(S.getSteps), steps]
      ])
      .select(S.getSteps)
      .select(S.getVerificationStep)
      .put(A.setVerificationStep(steps[0]))
      .run())
  it('should close all modals if there is no prev step', () =>
    expectSaga(goToPrevStep)
      .provide([
        [select(S.getVerificationStep), steps[0]],
        [select(S.getSteps), steps]
      ])
      .select(S.getSteps)
      .select(S.getVerificationStep)
      .put(actions.modals.closeAllModals())
      .run())
})

describe('goToNextStep saga', () => {
  const steps = ['personal', 'mobile']
  it('should direct user to next step if it is available', () =>
    expectSaga(goToNextStep)
      .provide([
        [select(S.getVerificationStep), steps[0]],
        [select(S.getSteps), steps]
      ])
      .select(S.getSteps)
      .select(S.getVerificationStep)
      .put(A.setVerificationStep(steps[1]))
      .run())
  it('should close all modals if there is no next step', () =>
    expectSaga(goToNextStep)
      .provide([
        [select(S.getVerificationStep), steps[1]],
        [select(S.getSteps), steps]
      ])
      .select(S.getSteps)
      .select(S.getVerificationStep)
      .put(actions.modals.closeAllModals())
      .run())
})

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
  it('should return if user exists', () => {
    const saga = testSaga(createRegisterUserCampaign)
    saga
      .next()
      .call(verifyIdentity)
      .next(true)
      .isDone()
  })
  describe('should get user id if user needs verification', () => {
    const saga = testSaga(createRegisterUserCampaign)
    it('should attempt to verify id', () => {
      saga.next().call(verifyIdentity)
    })
    it('should createUser', () => {
      saga.next(false).call(createUser)
    })
    it('should register user campaign', () => {
      saga
        .next()
        .call(registerUserCampaign, { newUser: true })
        .next()
        .isDone()
    })
  })
})
