import { testSaga } from 'redux-saga-test-plan'

import { Remote } from 'blockchain-wallet-v4/src'
import * as C from 'services/AlertService'
import * as selectors from '../selectors'
import * as actions from '../actions'
import { model } from 'data'
import goalsSagas from './sagas'
import { getAllBalances } from 'data/balance/sagas'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
jest.mock('data/balance/sagas', () => ({
  getBtcBalance: jest.fn(),
  getAllBalances: jest.fn()
}))
const api = {
  getWalletNUsers: jest.fn()
}

describe('goals sagas', () => {
  const {
    defineGoals,
    defineDeepLinkGoals,
    defineActionGoal,
    defineSendBtcGoal,
    defineReferralGoal,
    runGoal,
    runSwapGetStartedGoal,
    runKycDocResubmitGoal,
    runKycGoal,
    runReferralGoal,
    runSendBtcGoal,
    runSwapUpgradeGoal,
    runWelcomeGoal,
    showInitialModal,
    isKycNotFinished,
    waitForUserData
  } = goalsSagas({ api })
  const mathCopy = global.Math
  const mockGoalId = '4h96hsvbcj'
  const mockLogLocation = 'goals/sagas'

  beforeAll(() => {
    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0.1244251629529336
    global.Math = mockMath
  })

  afterAll(() => {
    global.Math = mathCopy
  })

  describe('defineGoals saga', () => {
    describe('should define goal if match found on route', () => {
      const saga = testSaga(defineGoals)
      const mockPathname = '/open/payment'
      const mockSearch = '?param=42'

      it('should get search params from router location', () => {
        saga.next().select(selectors.router.getSearch)
      })

      it('should get pathname from router location', () => {
        saga.next(mockSearch).select(selectors.router.getPathname)
      })

      it('should wait for location change an match on goal deeplink', () => {
        saga.next(mockPathname).take('@@router/LOCATION_CHANGE')
      })

      it('should find match and define the goal', () => {
        saga.next().call(defineDeepLinkGoals, 'payment', mockSearch)
      })

      it('should end saga', () => {
        saga.next().isDone()
      })
    })

    describe('should not define goals if no match found on route', () => {
      const saga = testSaga(defineGoals)

      it('should get search params from router location', () => {
        saga.next().select(selectors.router.getSearch)
      })

      it('should get pathname from router location', () => {
        saga.next().select(selectors.router.getPathname)
      })

      it('should wait for location change an match on goal deeplink', () => {
        saga.next('/notagoal/payment').take('@@router/LOCATION_CHANGE')
      })

      it('should end saga on no match', () => {
        saga.next().isDone()
      })
    })
  })

  describe('defineDeepLinkGoals saga', () => {
    const mockSearch = '?test=search'

    describe('should define referral goal when asked', () => {
      const saga = testSaga(defineDeepLinkGoals, 'referral', mockSearch)

      it('should call defineReferralGoal goal', () => {
        saga.next().call(defineReferralGoal, mockSearch)
      })

      it('should end saga', () => {
        saga.next().isDone()
      })
    })

    describe('should define bitcoin goal when asked', () => {
      const mockPathname = 'bitcoin'
      const saga = testSaga(defineDeepLinkGoals, mockPathname, mockSearch)

      it('should call defineReferralGoal goal', () => {
        saga.next().call(defineSendBtcGoal, mockPathname, mockSearch)
      })

      it('should end saga', () => {
        saga.next().isDone()
      })
    })

    describe('should define action goal when asked', () => {
      const mockPathname = 'action'
      const saga = testSaga(defineDeepLinkGoals, mockPathname, mockSearch)

      it('should call defineReferralGoal goal', () => {
        saga.next().call(defineActionGoal, mockPathname, mockSearch)
      })

      it('should end saga', () => {
        saga.next().isDone()
      })
    })
  })

  describe('defineActionGoal saga', () => {
    it('should save action goal and route to /wallet', () => {
      const mockUrlEncoded =
        'eyJuYW1lIjoiL29wZW4vYWN0aW9uIiwiZGF0YSI6Ij9uYW1lPWZha2VBY3Rpb24mZGF0YT1pZGsifQ=='
      const saga = testSaga(defineActionGoal, mockUrlEncoded, '')

      saga
        .next()
        .put(
          actions.goals.saveGoal('/open/action', '?name=fakeAction&data=idk')
        )
        .next()
        .put(actions.router.push('/wallet'))
        .next()
        .isDone()
    })
  })

  describe('defineSendBtcGoal saga', () => {
    it('should save payment goal and route to /wallet', () => {
      const mockPathnameEncoded = 'bitcoin%3A12ms1QW9SNobD5CmBN59zWxcMKs1spB86s'
      const mockSearchEncoded = '%3Famount%3D0.00275134%26message%3Dtest'
      const saga = testSaga(
        defineSendBtcGoal,
        mockPathnameEncoded,
        mockSearchEncoded
      )

      saga
        .next()
        .put(
          actions.goals.saveGoal('payment', {
            address: '12ms1QW9SNobD5CmBN59zWxcMKs1spB86s',
            amount: 0.00275134,
            description: 'test'
          })
        )
        .next()
        .put(actions.router.push('/wallet'))
        .next()
        .put(actions.alerts.displayInfo(C.PLEASE_LOGIN))
        .next()
        .isDone()
    })
  })
  describe('defineReferralGoal saga', () => {
    const mockSearch =
      '?campaign=sunriver&campaign_code=123&campaign_email=test@test.com'

    describe('should route to /signup for new user', () => {
      const newUserSearch = mockSearch + '&newUser=true'
      const saga = testSaga(defineReferralGoal, newUserSearch)

      it('should call defineReferralGoal goal', () => {
        saga.next().put(
          actions.goals.saveGoal('referral', {
            name: 'sunriver',
            code: '123',
            email: 'test@test.com'
          })
        )
      })

      it('should route to /signup', () => {
        saga.next().put(actions.router.push('/signup'))
      })

      it('should end saga', () => {
        saga.next().isDone()
      })
    })

    describe('should route to /login for existing user', () => {
      const saga = testSaga(defineReferralGoal, mockSearch)

      it('should call defineReferralGoal goal', () => {
        saga.next().put(
          actions.goals.saveGoal('referral', {
            name: 'sunriver',
            code: '123',
            email: 'test@test.com'
          })
        )
      })

      it('should route to /login', () => {
        saga.next().put(actions.router.push('/login'))
      })

      it('should end saga', () => {
        saga.next().isDone()
      })
    })
  })

  describe('runGoal saga', () => {
    describe('should run referral goal', () => {
      const mockGoal = { name: 'referral', data: {} }
      const saga = testSaga(runGoal, mockGoal)

      it('should call runReferralGoal saga and end', () => {
        saga.next().call(runReferralGoal, mockGoal)
        saga.next().isDone()
      })
    })
    describe('should run payment goal', () => {
      const mockGoal = { name: 'payment', data: {} }
      const saga = testSaga(runGoal, mockGoal)

      it('should call runSendBtcGoal saga and end', () => {
        saga.next().call(runSendBtcGoal, mockGoal)
        saga.next().isDone()
      })
    })
    describe('should run kyc goal', () => {
      const mockGoal = { name: 'kyc', data: {} }
      const saga = testSaga(runGoal, mockGoal)

      it('should call runKyc saga and end', () => {
        saga.next().call(runKycGoal, mockGoal)
        saga.next().isDone()
      })
    })
    describe('should run kycDocResubmit goal', () => {
      const mockGoal = { name: 'kycDocResubmit', data: {} }
      const saga = testSaga(runGoal, mockGoal)

      it('should call runKycDocResubmitGoal saga and end', () => {
        saga.next().call(runKycDocResubmitGoal, mockGoal)
        saga.next().isDone()
      })
    })
    describe('should run swapUpgrade goal', () => {
      const mockGoal = { name: 'swapUpgrade', data: {} }
      const saga = testSaga(runGoal, mockGoal)

      it('should call swapUpgrade saga and end', () => {
        saga.next().call(runSwapUpgradeGoal, mockGoal)
        saga.next().isDone()
      })
    })
    describe('should run swapGetStarted goal', () => {
      const mockGoal = { name: 'swapGetStarted', data: {} }
      const saga = testSaga(runGoal, mockGoal)

      it('should call runSwapGetStartedGoal saga and end', () => {
        saga.next().call(runSwapGetStartedGoal, mockGoal)
        saga.next().isDone()
      })
    })
    describe('should run welcome goal', () => {
      const mockGoal = { name: 'welcome', data: {} }
      const saga = testSaga(runGoal, mockGoal)

      it('should call runWelcomeGoal saga and end', () => {
        saga.next().call(runWelcomeGoal, mockGoal)
        saga.next().isDone()
      })
    })
  })

  describe('runReferralGoal saga', () => {
    const mockGoalData = { name: 'sunriver' }
    const saga = testSaga(runReferralGoal, {
      id: mockGoalId,
      data: mockGoalData
    })

    it('should delete goal', () => {
      saga.next().put(actions.goals.deleteGoal(mockGoalId))
    })

    it('should add initial modal and set campaign', () => {
      saga
        .next()
        .put(actions.goals.addInitialModal('sunriver', 'SunRiverWelcome'))
        .next()
        .put(actions.modules.profile.setCampaign(mockGoalData))
        .next()
        .isDone()
    })
  })

  describe('runWelcomeGoal saga', () => {
    describe('should not show welcome modal if not first login', () => {
      const saga = testSaga(runWelcomeGoal, {
        id: mockGoalId,
        data: { firstLogin: false }
      })

      it('should delete goal and show login success', () => {
        saga
          .next()
          .put(actions.goals.deleteGoal(mockGoalId))
          .next()
          .put(
            actions.logs.logInfoMessage(
              mockLogLocation,
              'runWelcomeGoal',
              'login success'
            )
          )
          .next()
          .isDone()
      })
    })

    describe('should show welcome modal on first login', () => {
      const saga = testSaga(runWelcomeGoal, {
        id: mockGoalId,
        data: { firstLogin: true }
      })

      it('should delete goal and show welcome modal', () => {
        saga
          .next()
          .put(actions.goals.deleteGoal(mockGoalId))
          .next()
          .call(api.getWalletNUsers)
          .next({ values: [{ y: 26000000 }] })
          .put(
            actions.goals.addInitialModal('welcome', 'Welcome', {
              walletMillions: 26
            })
          )
          .next()
          .isDone()
      })
    })
  })

  describe('runSwapGetStartedGoal saga', () => {
    it('should not show modal if it has already been seen', () => {
      const saga = testSaga(runSwapGetStartedGoal, { id: mockGoalId })

      saga
        .next()
        .put(actions.goals.deleteGoal(mockGoalId))
        .next()
        .select(selectors.preferences.getShowKycGetStarted)
        .next(false)
        .isDone()
    })

    it('should show modal if wallet has funds and kyc not completed', () => {
      const saga = testSaga(runSwapGetStartedGoal, { id: mockGoalId })
      selectors.modules.profile = { getUserKYCState: () => Remote.of(false) }

      saga
        .next()
        .put(actions.goals.deleteGoal(mockGoalId))
        .next()
        .select(selectors.preferences.getShowKycGetStarted)
        .next(true)
        .call(getAllBalances)
        .next({ btc: 33234, eth: 534 })
        .call(waitForUserData)
        .next()
        .call(isKycNotFinished)
        .next(true)
        .put(actions.goals.addInitialModal('swapGetStarted', 'SwapGetStarted'))
        .next()
        .isDone()
    })
  })

  describe('runSwapUpgradeGoal saga', () => {
    it('should not show modal if it has already been seen', () => {
      const saga = testSaga(runSwapUpgradeGoal, { id: mockGoalId })

      saga
        .next()
        .put(actions.goals.deleteGoal(mockGoalId))
        .next()
        .select(selectors.preferences.getShowSwapUpgrade)
        .next(false)
        .isDone()
    })

    it("should show modal if wallet has balance that's close to the tier 1 limit", () => {
      const saga = testSaga(runSwapUpgradeGoal, { id: mockGoalId })
      selectors.modules.profile = { closeToTier1Limit: () => Remote.of(true) }

      saga
        .next()
        .put(actions.goals.deleteGoal(mockGoalId))
        .next()
        .select(selectors.preferences.getShowSwapUpgrade)
        .next(true)
        .call(waitForUserData)
        .next()
        .select(selectors.modules.profile.closeToTier1Limit)
        .next(Remote.of(true))
        .put(
          actions.goals.addInitialModal('swapUpgrade', 'SwapUpgrade', {
            nextTier: model.profile.TIERS[2],
            currentTier: model.profile.TIERS[1]
          })
        )
        .next()
        .isDone()
    })
  })

  describe('showInitialModal saga', () => {
    const saga = testSaga(showInitialModal)

    it('should show sunriver modal', () => {
      const mockModals = {
        sunriver: { name: 'sunriver', data: {} }
      }
      saga
        .next()
        .select(selectors.goals.getInitialModals)
        .next(mockModals)
        .put(
          actions.modals.showModal(
            mockModals.sunriver.name,
            mockModals.sunriver.data
          )
        )
        .next()
        .isDone()
    })

    it('should show payment modal', () => {
      const mockModals = {
        payment: { name: 'payment', data: {} }
      }
      saga
        .restart()
        .next()
        .select(selectors.goals.getInitialModals)
        .next(mockModals)
        .put(
          actions.modals.showModal(
            mockModals.payment.name,
            mockModals.payment.data
          )
        )
        .next()
        .isDone()
    })

    it('should show swapGetStarted modal', () => {
      const mockModals = {
        swapGetStarted: { name: 'swapGetStarted', data: {} }
      }
      saga
        .restart()
        .next()
        .select(selectors.goals.getInitialModals)
        .next(mockModals)
        .put(
          actions.modals.showModal(
            mockModals.swapGetStarted.name,
            mockModals.swapGetStarted.data
          )
        )
        .next()
        .isDone()
    })

    it('should show welcome modal', () => {
      const mockModals = {
        welcome: { name: 'welcome', data: {} }
      }

      saga
        .restart()
        .next()
        .select(selectors.goals.getInitialModals)
        .next(mockModals)
        .put(
          actions.modals.showModal(
            mockModals.welcome.name,
            mockModals.welcome.data
          )
        )
        .next()
        .isDone()
    })
  })
})
