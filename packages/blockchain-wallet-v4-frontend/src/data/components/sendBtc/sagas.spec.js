import * as A from './actions'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import { FORM } from './model'
import { initialize } from 'redux-form'
import { testSaga } from 'redux-saga-test-plan'
import sendBtcSagas, { logLocation } from './sagas.ts'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
}
const coreSagas = coreSagasFactory({ api })
const networks = { btc: 'bitcoin' }

describe('sendBtc sagas', () => {
  // Mocking Math.random() to have identical popup ids for action testing
  const originalMath = Object.create(Math)
  let pushStateSpy
  let locationReloadSpy
  beforeAll(() => {
    Math.random = () => 0.5
    pushStateSpy = jest
      .spyOn(window.history, 'pushState')
      .mockImplementation(() => {})
    locationReloadSpy = jest
      .spyOn(window.location, 'reload')
      .mockImplementation(() => {})
  })
  afterAll(() => {
    global.Math = originalMath
    pushStateSpy.restore()
    locationReloadSpy.restore()
  })
  const { initialized, firstStepSubmitClicked } = sendBtcSagas({
    api,
    coreSagas,
    networks
  })

  const feeType = 'regular'
  const feePerByte = 1
  const value = {
    fees: {
      [feeType]: feePerByte
    }
  }
  const paymentMock = {
    value: jest.fn(),
    init: jest.fn(() => paymentMock),
    to: jest.fn(() => paymentMock),
    amount: jest.fn(() => paymentMock),
    from: jest.fn(() => paymentMock),
    fee: jest.fn(() => paymentMock),
    build: jest.fn(() => paymentMock),
    buildSweep: jest.fn(() => paymentMock),
    sign: jest.fn(() => paymentMock),
    publish: jest.fn(() => paymentMock),
    description: jest.fn(() => paymentMock),
    chain: jest.fn()
  }
  paymentMock.value.mockReturnValue(value)

  coreSagas.payment.btc.create.mockImplementation(() => {
    return paymentMock
  })

  describe('btc send form initialize', () => {
    const to = null
    const description = 'message'
    const amount = {
      coin: 1,
      fiat: 10000
    }
    const payload = { description, amount, feeType }

    const saga = testSaga(initialized, { payload })

    const defaultIndex = 0
    const defaultAccount = 'account1'
    const accountsRStub = Remote.of([defaultAccount, 'account2'])
    const initialValues = {
      coin: 'BTC',
      amount,
      to,
      description,
      from: defaultAccount,
      feePerByte: feePerByte,
      payPro: undefined
    }

    const beforeEnd = 'beforeEnd'

    it('should trigger a loading action', () => {
      saga.next().put(A.sendBtcPaymentUpdatedLoading())
    })

    it('should fetch exchange addresses', () => {
      saga
        .next()
        .put(actions.components.send.fetchPaymentsAccountExchange('BTC'))
    })

    it('should create payment', () => {
      saga.next()
      expect(coreSagas.payment.btc.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.btc.create).toHaveBeenCalledWith({
        network: networks.btc
      })
      expect(paymentMock.init).toHaveBeenCalledTimes(1)
    })

    it('should select accounts', () => {
      saga
        .next(paymentMock)
        .select(selectors.core.common.btc.getAccountsBalances)
    })

    it('should select defaultIndex', () => {
      saga
        .next(accountsRStub)
        .select(selectors.core.wallet.getDefaultAccountIndex)
    })

    it('should update payment from to defaultIndex', () => {
      saga.next(defaultIndex)

      expect(paymentMock.from).toHaveBeenCalledTimes(1)
      expect(paymentMock.from).toHaveBeenCalledWith(defaultIndex, 'ACCOUNT')
    })

    it('should update payment amount from value', () => {
      saga.next(paymentMock)

      expect(paymentMock.amount).toHaveBeenCalledTimes(1)
      expect(paymentMock.amount).toHaveBeenCalledWith(amount.coin * 100000000)
    })

    it('should update payment description from value', () => {
      saga.next(paymentMock)

      expect(paymentMock.description).toHaveBeenCalledTimes(1)
      expect(paymentMock.description).toHaveBeenCalledWith(description)
    })

    it('should update payment fee from value', () => {
      saga.next(paymentMock)

      expect(paymentMock.fee).toHaveBeenCalledTimes(1)
      expect(paymentMock.fee).toHaveBeenCalledWith(feePerByte)
    })

    it('should initialize sendBtc form with correct values', () => {
      saga.next(paymentMock).put(initialize(FORM, initialValues))
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
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'sendBtcInitialized',
              error
            )
          )
          .next()
          .isDone()
      })
    })
  })

  describe('btc send first step submit', () => {
    beforeAll(() => {
      coreSagas.payment.btc.create.mockClear()
      paymentMock.build.mockClear()
    })

    const saga = testSaga(firstStepSubmitClicked)

    const beforeError = 'beforeError'

    it('should select payment', () => {
      saga.next().select(S.getPayment)
    })

    it('should put loading action', () => {
      saga.next(Remote.of(paymentMock)).put(A.sendBtcPaymentUpdatedLoading())
    })

    it('should create payment from state value', () => {
      saga.next()
      expect(coreSagas.payment.btc.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.btc.create).toHaveBeenCalledWith({
        payment: paymentMock,
        network: networks.btc
      })
    })

    it('should build payment', () => {
      expect(paymentMock.build).toHaveBeenCalledTimes(1)
    })

    it('should put update success action', () => {
      saga
        .next(paymentMock)
        .put(A.sendBtcPaymentUpdatedSuccess(paymentMock.value()))
        .save(beforeError)
        .next()
        .isDone()
        .restore(beforeError)
    })

    describe('error handling', () => {
      const error = {}

      it('should log error', () => {
        saga
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'firstStepSubmitClicked',
              error
            )
          )
          .next()
          .isDone()
      })
    })
  })
})
