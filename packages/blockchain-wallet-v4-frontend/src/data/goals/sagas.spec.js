import { testSaga } from 'redux-saga-test-plan'

import * as actions from '../actions'
import * as C from 'services/AlertService'
import * as selectors from '../selectors'
import { getAllBalances } from 'data/balance/sagas'
import { model } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import goalsSagas from './sagas'

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
    defineSendCryptoGoal,
    defineReferralGoal,
    isKycNotFinished,
    runSwapGetStartedGoal,
    runKycGoal,
    runReferralGoal,
    runSwapUpgradeGoal,
    runWalletTour,
    waitForUserData,
    showInitialModal
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
        saga.next().call(defineSendCryptoGoal, mockPathname, mockSearch)
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

  describe('defineSendCryptoGoal saga', () => {
    it('should save payment goal and route to /wallet', () => {
      const mockPathnameEncoded = 'bitcoin%3A12ms1QW9SNobD5CmBN59zWxcMKs1spB86s'
      const mockSearchEncoded = '%3Famount%3D0.00275134%26message%3Dtest'
      const saga = testSaga(
        defineSendCryptoGoal,
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
    it('should save payment protocol goal and route to /wallet', () => {
      const mockPathnameEncoded =
        'bitcoin%3A%3Fr%3Dhttps://bitpay.com/i/LKJLKJ3LKJ34HH'
      const mockSearchEncoded = ''
      const saga = testSaga(
        defineSendCryptoGoal,
        mockPathnameEncoded,
        mockSearchEncoded
      )

      saga
        .next()
        .put(
          actions.goals.saveGoal('paymentProtocol', {
            coin: 'BTC',
            r: 'https://bitpay.com/i/LKJLKJ3LKJ34HH'
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

  describe('runWalletTour saga', () => {
    describe('should not show wallet tour modal if not first login', () => {
      const saga = testSaga(runWalletTour, {
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
              'runWalletTour',
              'login success'
            )
          )
          .next()
          .isDone()
      })
    })
  })

  describe('runKycGoal saga', () => {
    it('should not show kyc if current tier is >= goal tier', () => {
      const saga = testSaga(runKycGoal, { id: mockGoalId, data: { tier: 2 } })

      saga
        .next()
        .put(actions.goals.deleteGoal(mockGoalId))
        .next()
        .call(waitForUserData)
        .next()
        .select(selectors.modules.profile.getUserTiers)
        .next(Remote.of({ current: 2 }))
        .isDone()
    })

    it('should show kyc if current tier is < goal tier', () => {
      const goalTier = 2
      const saga = testSaga(runKycGoal, {
        id: mockGoalId,
        data: { tier: goalTier }
      })
      saga
        .next()
        .put(actions.goals.deleteGoal(mockGoalId))
        .next()
        .call(waitForUserData)
        .next()
        .select(selectors.modules.profile.getUserTiers)
        .next(Remote.of({ current: 1 }))
        .put(actions.components.identityVerification.verifyIdentity(goalTier))
        .next()
        .isDone()
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
  })
})
