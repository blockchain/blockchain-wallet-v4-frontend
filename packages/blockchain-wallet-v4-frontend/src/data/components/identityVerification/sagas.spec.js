import { call, select } from 'redux-saga-test-plan/matchers'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'

import * as A from './actions'
import * as S from './selectors'
import { actions, model, selectors } from 'data'
import { getSmsVerified } from 'blockchain-wallet-v4/src/redux/settings/selectors'
import { getUserData, getUserTiers } from 'data/modules/profile/selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import profileSagas from 'data/modules/profile/sagas'
import sagas, { logLocation, noCampaignDataError } from './sagas.ts'

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
  it('should set default values: need more info as false, and "2" as desired tier', () => {
    expectSaga(initializeVerification, { payload: {} })
      .provide([
        [call.fn(initializeStep), jest.fn()],
        [call.fn(defineSteps), jest.fn()]
      ])
      .call(defineSteps, TIERS[2], false)
      .call(initializeStep)
      .run()
  })
})

describe('defineSteps saga', () => {
  // it('should put steps loading action, call createUser and selectTier', () =>
  //   expectSaga(defineSteps, TIERS[2], false, false)
  //     .provide([[call.fn(selectTier), jest.fn()]])
  //     .put(A.setStepsLoading())
  //     .call(createUser)
  //     .call(selectTier, TIERS[2])
  //     .select(selectors.modules.profile.getUserTiers)
  //     .select(selectors.modules.profile.getUserData)
  //     .select(selectors.core.settings.getSmsVerified)
  //     .select(S.getVerificationStep)
  //     .put(A.setStepsSuccess(['personal', 'mobile', 'verify', 'submitted']))
  //     .run())

  it('should put steps loading failure if selectTier fails', () => {
    const error = 'error'
    expectSaga(defineSteps, TIERS[2], false, false)
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
  it('should select steps and initialize first step', () => {
    expectSaga(initializeStep)
      .provide([[select(S.getSteps), Remote.of(steps)]])
      .select(S.getSteps)
      .put(A.setVerificationStep(steps[0]))
      .run()
  })
})

describe('goToPrevStep saga', () => {
  const steps = ['personal', 'mobile']
  it('should direct user to prev step if it is available', () => {
    expectSaga(goToPrevStep)
      .withState({
        components: {
          identityVerification: {
            steps: Remote.of(steps),
            verificationStep: steps[1]
          }
        }
      })
      .provide([
        [select(S.getVerificationStep), steps[1]],
        [select(S.getSteps), Remote.of(steps)]
      ])
      .select()
      .put(A.setVerificationStep(steps[0]))
      .run()
  })

  it('should close all modals if there is no prev step', () => {
    expectSaga(goToPrevStep)
      .withState({
        components: {
          identityVerification: {
            steps: Remote.of(steps),
            verificationStep: steps[0]
          }
        }
      })
      .provide([
        [select(S.getVerificationStep), steps[0]],
        [select(S.getSteps), Remote.of(steps)]
      ])
      .select()
      .put(actions.modals.closeAllModals())
      .run()
  })
})

describe('goToNextStep saga', () => {
  const steps = ['personal', 'mobile']
  it('should direct user to next step if it is available', () => {
    expectSaga(goToNextStep)
      .provide([
        [select(S.getVerificationStep), steps[0]],
        [select(S.getSteps), Remote.of(steps)]
      ])
      .select(S.getSteps)
      .select(S.getVerificationStep)
      .put(A.setVerificationStep(steps[1]))
      .run()
  })

  it('should close all modals if there is no next step', () => {
    expectSaga(goToNextStep)
      .provide([
        [select(S.getVerificationStep), steps[1]],
        [select(S.getSteps), Remote.of(steps)]
      ])
      .select(S.getSteps)
      .select(S.getVerificationStep)
      .put(actions.modals.closeAllModals())
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
  it('should select campaign, resolve campaign data and register user campaign', () => {
    const saga = testSaga(registerUserCampaign, { newUser })
    saga
      .next()
      .select(selectors.modules.profile.getCampaign)
      .next(campaign)
      .call(getCampaignData, campaign)
      .next(campaignData)
      .call(api.registerUserCampaign, campaign.name, campaignData, newUser)
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
})
