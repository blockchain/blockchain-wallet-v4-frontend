import { select } from 'redux-saga/effects'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { initialize } from 'redux-form'
import { path, prop } from 'ramda'
import { call } from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'

import rootReducer from '../../rootReducer'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as A from './actions'
import * as S from './selectors'
import { FORM } from './model'
import * as C from 'services/AlertService'
import { actions, selectors } from 'data'
import sendBtcSagas, { logLocation } from './sagas'
import { promptForSecondPassword } from 'services/SagaService'

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
  const {
    initialized,
    firstStepSubmitClicked,
    secondStepSubmitClicked
  } = sendBtcSagas({ api, coreSagas, networks })

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

  describe('btc send form intialize', () => {
    const to = 'btcaddress'
    const description = 'message'
    const amount = {
      coin: 1,
      fiat: 10000
    }
    const payload = { to, description, amount, feeType }

    const saga = testSaga(initialized, { payload })

    const defaultIndex = 0
    const defaultAccount = 'account1'
    const accountsRStub = Remote.of([defaultAccount, 'account2'])
    const initialValues = {
      to,
      coin: 'BTC',
      amount,
      description,
      from: defaultAccount,
      feePerByte: feePerByte
    }

    const beforeEnd = 'beforeEnd'

    it('should trigger a loading action', () => {
      saga.next().put(A.sendBtcPaymentUpdatedLoading())
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

    describe('state change', () => {
      const xpub = 'xpub'
      const label = 'my wallet'
      const balance = 1
      const defaultIndex = 1
      const defaultAccount = {
        xpub,
        label,
        balance,
        index: defaultIndex
      }
      const stubAccounts = Remote.of([
        {
          xpub: '',
          label: '',
          balance: 0,
          index: 0
        },
        defaultAccount
      ])
      let resultingState = {}

      beforeEach(async () => {
        resultingState = await expectSaga(initialized, { payload })
          .withReducer(combineReducers(rootReducer))
          .provide([
            [
              select(selectors.core.common.btc.getAccountsBalances),
              stubAccounts
            ],
            [select(selectors.core.wallet.getDefaultAccountIndex), defaultIndex]
          ])
          .run()
          .then(prop('storeState'))
      })

      it('should produce correct form state', () => {
        const form = path(FORM.split('.'), resultingState.form)
        expect(form.initial).toEqual(form.values)
        expect(form.initial).toEqual({
          feePerByte,
          coin: 'BTC',
          amount,
          description,
          to,
          from: defaultAccount
        })
      })

      it('should produce correct sendBtc payment state', () => {
        expect(resultingState.components.sendBtc.payment).toEqual(
          Remote.Success(value)
        )
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
        .next()
        .put(
          actions.analytics.logEvent(['send_btc', 'click', 'first_step_submit'])
        )
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

  describe('btc send second step submit', () => {
    const saga = testSaga(secondStepSubmitClicked)
    const secondPassword = 'password'
    const description = 'description'
    const txId = 'txId'
    const beforeError = 'beforeError'
    beforeAll(() => {
      paymentMock.value.mockReturnValue({ ...value, description, txId })
      coreSagas.payment.btc.create.mockClear()
      paymentMock.sign.mockClear()
      paymentMock.publish.mockClear()
    })

    it('should put start submit action', () => {
      saga.next().put(actions.form.startSubmit(FORM))
    })

    it('should select payment', () => {
      saga.next().select(S.getPayment)
    })

    it('should prompt for second password', () => {
      saga.next(Remote.of(paymentMock)).call(promptForSecondPassword)
    })

    it('should create payment from state value', () => {
      expect(coreSagas.payment.btc.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.btc.create).toHaveBeenCalledWith({
        payment: paymentMock,
        network: networks.btc
      })
    })

    it('should sign payment with second passowrd', () => {
      saga.next(secondPassword)
      expect(paymentMock.sign).toHaveBeenCalledTimes(1)
      expect(paymentMock.sign).toHaveBeenCalledWith(secondPassword)
    })

    it('should publish payment', () => {
      saga.next(paymentMock)
      expect(paymentMock.publish).toHaveBeenCalledTimes(1)
    })

    it('should put btc fetch data action', () => {
      saga.next(paymentMock).put(actions.core.data.bitcoin.fetchData())
    })

    it('should put btc payment updated success action', () => {
      saga
        .next(paymentMock)
        .put(A.sendBtcPaymentUpdatedSuccess(paymentMock.value()))
    })

    it('should set transaction note if transaction has description', () => {
      saga.next().put(actions.core.wallet.setTransactionNote(txId, description))
    })

    it('should route to btc transactions', () => {
      saga.next().put(actions.router.push('/btc/transactions'))
    })

    it('should display succcess message', () => {
      saga
        .next()
        .put(actions.alerts.displaySuccess(C.SEND_BTC_SUCCESS))
        .save(beforeError)
    })

    it('should destroy form', () => {
      saga.next().put(actions.form.destroy(FORM))
    })

    it('should put action to close all modals', () => {
      saga
        .next()
        .put(actions.modals.closeAllModals())
        .next()
        .put(
          actions.analytics.logEvent([
            'send_btc',
            'click',
            'second_step_submit'
          ])
        )
        .next()
        .isDone()
    })

    describe('error handling', () => {
      const error = {}

      it('should stop form submit', () => {
        saga
          .restore(beforeError)
          .throw(error)
          .put(actions.form.stopSubmit(FORM))
      })

      it('should log error', () => {
        saga
          .next()
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'secondStepSubmitClicked',
              error
            )
          )
      })

      it('should display error message', () => {
        saga.next().put(actions.alerts.displayError(C.SEND_BTC_ERROR))
      })
    })

    it('should not set transaction not if payment has no description', () => {
      paymentMock.value.mockReturnValue({ ...value, description: '', txId })
      return expectSaga(secondStepSubmitClicked)
        .provide([
          [select(S.getPayment), Remote.of(paymentMock)],
          [call.fn(promptForSecondPassword), null]
        ])
        .not.put(actions.core.wallet.setTransactionNote(txId, description))
        .run()
    })
  })
})
