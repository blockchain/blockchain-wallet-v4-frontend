import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'

import profileSagas from 'data/modules/profile/sagas'
import { getUserTiers, getUserData } from 'data/modules/profile/selectors'
import { getSmsVerified } from 'blockchain-wallet-v4/src/redux/settings/selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import { actions, model, selectors } from 'data'
import * as A from './actions'
import * as S from './selectors'
import {
  EMAIL_STEPS,
  FLOW_TYPES,
  KYC_PROVIDERS,
  SUNRIVER_LINK_ERROR_MODAL
} from './model'
import sagas, {
  logLocation,
  wrongFlowTypeError,
  noCampaignDataError,
  noTokenError,
  invalidLinkError
} from './sagas'

const api = {
  fetchKycConfig: jest.fn(),
  sendDeeplink: jest.fn(),
  registerUserCampaign: jest.fn()
}

const coreSagas = {}

jest.mock('blockchain-wallet-v4/src/redux/settings/selectors')
jest.mock('data/modules/profile/sagas')
jest.mock('data/modules/profile/selectors')

const createUser = jest.fn()
const getCampaignData = jest.fn()
profileSagas.mockReturnValue({ createUser, getCampaignData })

const {
  checkKycFlow,
  createRegisterUserCampaign,
  defineSteps,
  goToNextStep,
  goToPrevStep,
  initializeVerification,
  initializeStep,
  registerUserCampaign,
  selectTier,
  verifyIdentity
} = sagas({ api, coreSagas })

const { TIERS } = model.profile

getSmsVerified.mockReturnValue(Remote.of(false))
getUserTiers.mockReturnValue(Remote.NotAsked)
getUserData.mockReturnValue(Remote.of({ mobileVerified: false }))

describe('initializeVerification saga', () => {
  it('should set default values: non-coinify kyc, need more info as false, and "2" as desired tier', () =>
    expectSaga(initializeVerification, { payload: {} })
      .provide([
        [call.fn(initializeStep), jest.fn()],
        [call.fn(defineSteps), jest.fn()]
      ])
      .call(defineSteps, TIERS[2], false, false)
      .call(initializeStep)
      .run())

  it("should define if it's coinify kyc, set desired tier, and determine initial step", () => {
    const isCoinify = true
    const needMoreInfo = true
    const tier = TIERS[1]
    return expectSaga(initializeVerification, {
      payload: { tier, isCoinify, needMoreInfo }
    })
      .provide([
        [call.fn(initializeStep), jest.fn()],
        [call.fn(defineSteps), jest.fn()]
      ])
      .put(A.setEmailStep(EMAIL_STEPS.edit))
      .call(defineSteps, tier, isCoinify, needMoreInfo)
      .call(initializeStep)
      .run()
  })
})

describe('defineSteps saga', () => {
  it('should put steps loading action, call createUser and selectTier', () =>
    expectSaga(defineSteps, TIERS[2], false, false)
      .provide([[call.fn(selectTier), jest.fn()]])
      .put(A.setStepsLoading())
      .call(createUser)
      .call(selectTier, TIERS[2])
      .select(selectors.modules.profile.getUserTiers)
      .select(selectors.modules.profile.getUserData)
      .select(selectors.core.settings.getSmsVerified)
      .select(S.getVerificationStep)
      .put(A.setStepsSuccess(['personal', 'mobile', 'verify']))
      .run())

  it('should put steps loading failure if selectTier fails', () => {
    const error = 'error'
    return expectSaga(defineSteps, TIERS[2], false, false)
      .provide([[call.fn(selectTier), throwError(error)]])
      .put(A.setStepsLoading())
      .call(createUser)
      .call(selectTier, TIERS[2])
      .put(A.setStepsFailure(error))
      .run()
  })
})

describe('initializeStep saga', () => {
  const steps = ['personal', 'mobile', 'verify']
  it('should select steps and initialize first step', () =>
    expectSaga(initializeStep)
      .provide([[select(S.getSteps), Remote.of(steps)]])
      .select(S.getSteps)
      .put(A.setVerificationStep(steps[0]))
      .run())
})

describe('goToPrevStep saga', () => {
  const steps = ['personal', 'mobile']
  it('should direct user to prev step if it is available', () =>
    expectSaga(goToPrevStep)
      .provide([
        [select(S.getVerificationStep), steps[1]],
        [select(S.getSteps), Remote.of(steps)]
      ])
      .select(S.getSteps)
      .select(S.getVerificationStep)
      .put(A.setVerificationStep(steps[0]))
      .run())
  it('should close all modals if there is no prev step', () =>
    expectSaga(goToPrevStep)
      .provide([
        [select(S.getVerificationStep), steps[0]],
        [select(S.getSteps), Remote.of(steps)]
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
        [select(S.getSteps), Remote.of(steps)]
      ])
      .select(S.getSteps)
      .select(S.getVerificationStep)
      .put(A.setVerificationStep(steps[1]))
      .run())
  it('should close all modals if there is no next step', () =>
    expectSaga(goToNextStep)
      .provide([
        [select(S.getVerificationStep), steps[1]],
        [select(S.getSteps), Remote.of(steps)]
      ])
      .select(S.getSteps)
      .select(S.getVerificationStep)
      .put(actions.modals.closeAllModals())
      .run())
})

describe('checkKycFlow saga', () => {
  it('should set flow config', () => {
    const flowType = FLOW_TYPES.LOW
    const kycProvider = KYC_PROVIDERS.ONFIDO
    api.fetchKycConfig.mockResolvedValue({ flowType, kycProvider })
    return expectSaga(checkKycFlow)
      .put(A.setKycFlow(Remote.Loading))
      .call(api.fetchKycConfig)
      .put(A.setKycFlow(Remote.of({ flowType, kycProvider })))
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
  it('should call verify identity and register user campaign', () => {
    const saga = testSaga(createRegisterUserCampaign)
    saga
      .next()
      .call(verifyIdentity, { payload: { tier: TIERS[2] } })
      .next()
      .isDone()
  })
})

describe('registerUserCampaign', () => {
  const newUser = true
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZXRhaWwtY29yZSIsImV4cCI6MTUzNDA0NTg2MywiaWF0IjoxNTM0MDAyNjYzLCJ1c2VySUQiOiIzZDQ0OGFkNy0wZTJjLTRiNjUtOTFiMC1jMTQ5ODkyZTI0M2MiLCJqdGkiOiJkMGIyMDc3My03NDg3LTRhM2EtOWE1MC0zYmEzNzBlZWU4NjkifQ.O24d8dozP4KjNFMHPYaBNMISvQZXC3gPhSCXDIP-Eok'
  const campaign = {
    name: 'sunriver',
    code: '1234',
    email: 'f@ke.mail'
  }
  const campaignData = {
    'x-campaign-address':
      'GDRXE2BQUC3AZNPVFSCEZ76NJ3WWL25FYFK6RGZGIEKWE4SOOHSUJUJ6',
    'x-campaign-code': campaign.code,
    'x-campaign-email': campaign.email
  }
  it('should select campaign, resolve campaign data, select api token and register user campaign', () => {
    const saga = testSaga(registerUserCampaign, { newUser })
    saga
      .next()
      .select(selectors.modules.profile.getCampaign)
      .next(campaign)
      .call(getCampaignData, campaign)
      .next(campaignData)
      .select(selectors.modules.profile.getApiToken)
      .next(Remote.of(token))
      .call(
        api.registerUserCampaign,
        token,
        campaign.name,
        campaignData,
        newUser
      )
      .next()
      .isDone()
  })
  it("should not continue past selection of campaign if there's no campaign or campaign is empty", () => {
    testSaga(registerUserCampaign, { newUser })
      .next()
      .select(selectors.modules.profile.getCampaign)
      .next(null)
      .put(
        actions.logs.logErrorMessage(
          logLocation,
          'registerUserCampaign',
          noCampaignDataError
        )
      )
      .next()
      .isDone()
    testSaga(registerUserCampaign, { newUser })
      .next()
      .select(selectors.modules.profile.getCampaign)
      .next({})
      .put(
        actions.logs.logErrorMessage(
          logLocation,
          'registerUserCampaign',
          noCampaignDataError
        )
      )
      .next()
      .isDone()
  })
  it("should not continue past selection of token if there's no token", () => {
    const saga = testSaga(registerUserCampaign, { newUser })
    saga
      .next()
      .select(selectors.modules.profile.getCampaign)
      .next(campaign)
      .call(getCampaignData, campaign)
      .next(campaignData)
      .select(selectors.modules.profile.getApiToken)
      .next(Remote.of(null))
      .put(
        actions.logs.logErrorMessage(
          logLocation,
          'registerUserCampaign',
          noTokenError
        )
      )
      .next()
      .isDone()
  })
  it('should show error modal and log error if registering fails', () => {
    const saga = testSaga(registerUserCampaign, { newUser })
    const error = new Error()
    saga
      .next()
      .select(selectors.modules.profile.getCampaign)
      .next(campaign)
      .call(getCampaignData, campaign)
      .next(campaignData)
      .select(selectors.modules.profile.getApiToken)
      .next(Remote.of(token))
      .call(
        api.registerUserCampaign,
        token,
        campaign.name,
        campaignData,
        newUser
      )
      .throw(error)
      .put(actions.modals.showModal(SUNRIVER_LINK_ERROR_MODAL))
      .next()
      .put(actions.modules.profile.setCampaign({}))
      .next()
      .put(
        actions.logs.logErrorMessage(
          logLocation,
          'registerUserCampaign',
          invalidLinkError
        )
      )
      .next()
      .isDone()
  })
})
