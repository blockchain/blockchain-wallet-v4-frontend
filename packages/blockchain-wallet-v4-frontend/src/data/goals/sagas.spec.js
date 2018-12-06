import { testSaga } from 'redux-saga-test-plan'

import { actions, selectors } from 'data'
import goalsSagas from './sagas'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const api = {
  getWalletNUsers: jest.fn()
}

describe('goals sagas', () => {
  const {
    defineGoals,
    runGoal,
    showInitialModal,
    runSendBtcGoal,
    runReferralGoal,
    runWelcomeGoal,
    runKycGoal,
    defineDeepLinkGoals,
    defineActionGoal,
    defineSendBtcGoal,
    defineReferralGoal
  } = goalsSagas({ api })
  const mathCopy = global.Math

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
    describe('should run payment goal', () => {
      const mockGoal = { name: 'payment', data: {} }
      const saga = testSaga(runGoal, mockGoal)

      it('should call runSendBtcGoal saga and end', () => {
        saga.next().call(runSendBtcGoal, mockGoal)
        saga.next().isDone()
      })
    })
    describe('should run referral goal', () => {
      const mockGoal = { name: 'referral', data: {} }
      const saga = testSaga(runGoal, mockGoal)

      it('should call runSendBtcGoal saga and end', () => {
        saga.next().call(runReferralGoal, mockGoal)
        saga.next().isDone()
      })
    })
    describe('should run welcome goal', () => {
      const mockGoal = { name: 'welcome', data: {} }
      const saga = testSaga(runGoal, mockGoal)

      it('should call runSendBtcGoal saga and end', () => {
        saga.next().call(runWelcomeGoal, mockGoal)
        saga.next().isDone()
      })
    })
    describe('should run kyc goal', () => {
      const mockGoal = { name: 'kyc', data: {} }
      const saga = testSaga(runGoal, mockGoal)

      it('should call runSendBtcGoal saga and end', () => {
        saga.next().call(runKycGoal, mockGoal)
        saga.next().isDone()
      })
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

    it('should show swap modal', () => {
      const mockModals = {
        swap: { name: 'swap', data: {} }
      }
      saga
        .restart()
        .next()
        .select(selectors.goals.getInitialModals)
        .next(mockModals)
        .put(
          actions.modals.showModal(mockModals.swap.name, mockModals.swap.data)
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
