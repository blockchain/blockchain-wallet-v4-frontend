import { select } from 'redux-saga/effects'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { fork, call } from 'redux-saga-test-plan/matchers'
import { initialize, change } from 'redux-form'

import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as A from './actions'
import * as S from './selectors'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import sendBtcSagas, { logLocation } from './sagas'
import * as C from 'services/AlertService'
import settings from 'config'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
}
const coreSagas = coreSagasFactory({ api })

describe('authSagas', () => {
  // Mocking Math.random() to have identical popup ids for action testing
  const originalMath = Object.create(Math)
  let pushStateSpy
  let locationReloadSpy
  beforeAll(() => {
    Math.random = () => 0.5
    pushStateSpy = jest.spyOn(window.history, 'pushState').mockImplementation(() => {})
    locationReloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {})
  })
  afterAll(() => {
    global.Math = originalMath
    pushStateSpy.restore()
    locationReloadSpy.restore()
  })

  describe('btc send form intialize', () => {
    const { initialized } = sendBtcSagas({ api, coreSagas })

    const to = 'btcaddress'
    const message = 'message'
    const amount = {
      coin: 1,
      fiat: 10000
    }
    const feeType = 'regular'
    const payload = { to, message, amount, feeType }

    const saga = testSaga(initialized, { payload })

    const paymentMock = {
      value: jest.fn(),
      init: jest.fn(),
      to: jest.fn(),
      amount: jest.fn(),
      from: jest.fn(),
      fee: jest.fn(),
      build: jest.fn(),
      buildSweep: jest.fn(),
      sign: jest.fn(),
      publish: jest.fn(),
      description: jest.fn(),
      chain: jest.fn()
    }
    const feePerByte = 1
    const value = {
      fees: {
        [feeType]: feePerByte
      }
    }
    paymentMock.value.mockReturnValue(value)

    const defaultIndex = 0
    const defaultAccount = 'account1'
    const accountsRStub = Remote.of([defaultAccount, 'account2'])
    const initialValues = {
      to: to,
      coin: 'BTC',
      amount: amount,
      message: message,
      from: defaultAccount,
      feePerByte: feePerByte
    }

    coreSagas.payment.btc.create.mockImplementation(() => {
      return paymentMock
    })

    const beforeEnd = 'beforeEnd'

    it('should trigger a loading action', () => {
      saga.next().put(A.sendBtcPaymentUpdatedLoading())
    })

    it('should create payment', () => {
      saga.next()
      expect(coreSagas.payment.btc.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.btc.create).toHaveBeenCalledWith({ network: settings.NETWORK_BITCOIN })
      expect(paymentMock.init).toHaveBeenCalledTimes(1)
    })

    it('should select accounts', () => {
      saga.next(paymentMock).select(selectors.core.common.btc.getAccountsBalances)
    })

    it('should select defaultIndex', () => {
      saga.next(accountsRStub).select(selectors.core.wallet.getDefaultAccountIndex)
    })

    it('should update payment from to defaultIndex', () => {
      saga.next(defaultIndex)

      expect(paymentMock.from).toHaveBeenCalledTimes(1)
      expect(paymentMock.from).toHaveBeenCalledWith(defaultIndex)
    })

    it('should update payment fee from value', () => {
      saga.next(paymentMock)

      expect(paymentMock.fee).toHaveBeenCalledTimes(1)
      expect(paymentMock.fee).toHaveBeenCalledWith(feePerByte)
    })

    it('should initialize sendBtc form with correct values', () => {
      saga.next(paymentMock).put(initialize('sendBtc', initialValues))
    })

    it('should trigger btc payment updated success action', () => {
      saga
        .next()
        .put(A.sendBtcPaymentUpdatedSuccess(value))
        .save(beforeEnd)
        .next()
        .isDone()
    })

    describe('error handling', () => {
      const error = {}
      it('should trigger btc payment updated failure action', () => {
        saga
          .restore(beforeEnd)
          .throw(error)
          .put(A.sendBtcPaymentUpdatedFailure(error))
      })

      it('should log initialization error', () => {
        saga
          .next()
          .put(actions.logs.logErrorMessage(logLocation, 'sendBtcInitialized', error))
          .next()
          .isDone()
      })
    })
  })
})
