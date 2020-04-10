import { call } from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { initialize } from 'redux-form'
import { path, prop } from 'ramda'
import { select } from 'redux-saga/effects'

import * as A from './actions'
import * as C from 'services/AlertService'
import * as S from './selectors'
import { actions, model, selectors } from 'data'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import { FORM } from './model'
import { promptForSecondPassword } from 'services/SagaService'
import BitcoinCash from 'bitcoinforksjs-lib'
import rootReducer from '../../rootReducer'
import sendBchSagas, { logLocation } from './sagas.ts'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
}
const coreSagas = coreSagasFactory({ api })
const networks = {
  bch: BitcoinCash.networks['bitcoin']
}
const { TRANSACTION_EVENTS } = model.analytics

describe('sendBch sagas', () => {
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
  } = sendBchSagas({ api, coreSagas, networks })

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

  coreSagas.payment.bch.create.mockImplementation(() => {
    return paymentMock
  })

  describe('bch send form initialize', () => {
    const to = null
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
      amount,
      coin: 'BCH',
      to,
      description,
      from: defaultAccount,
      payPro: undefined
    }
    const beforeEnd = 'beforeEnd'

    it('should trigger a loading action', () => {
      saga.next().put(A.sendBchPaymentUpdatedLoading())
    })

    it('should fetch exchange addresses', () => {
      saga
        .next()
        .put(actions.components.send.fetchPaymentsAccountExchange('BCH'))
    })

    it('should create payment', () => {
      saga.next()
      expect(coreSagas.payment.bch.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.bch.create).toHaveBeenCalledWith({
        network: networks.bch
      })
      expect(paymentMock.init).toHaveBeenCalledTimes(1)
    })

    it('should select accounts', () => {
      saga
        .next(paymentMock)
        .select(selectors.core.common.bch.getAccountsBalances)
    })

    it('should select defaultIndex', () => {
      saga
        .next(accountsRStub)
        .select(selectors.core.kvStore.bch.getDefaultAccountIndex)
    })

    it('should update payment from to defaultIndex', () => {
      saga.next(Remote.of(defaultIndex))

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
      expect(paymentMock.fee).toHaveBeenCalledWith('regular')
    })

    it('should initialize sendBch form with correct values', () => {
      saga.next(paymentMock).put(initialize(FORM, initialValues))
    })

    it('should trigger bch payment updated success action', () => {
      saga
        .next()
        .put(A.sendBchPaymentUpdatedSuccess(value))
        .save(beforeEnd)
        .next()
        .isDone()
    })

    describe('error handling', () => {
      const error = {}
      it('should log initialization error', () => {
        saga
          .restore(beforeEnd)
          .throw(error)
          .put(A.sendBchPaymentUpdatedFailure(error))
          .next()
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'sendBchInitialized',
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
              select(selectors.core.common.bch.getAccountsBalances),
              stubAccounts
            ],
            [
              select(selectors.core.kvStore.bch.getDefaultAccountIndex),
              Remote.of(defaultIndex)
            ]
          ])
          .run()
          .then(prop('storeState'))
      })

      it('should produce correct form state', () => {
        const form = path(FORM.split('.'), resultingState.form)
        expect(form.initial).toEqual(form.values)
        expect(form.initial).toEqual({
          amount: { coin: 1, fiat: 10000 },
          coin: 'BCH',
          from: defaultAccount,
          description: 'message',
          payPro: undefined,
          to: null
        })
      })

      it('should produce correct sendBch payment state', () => {
        expect(resultingState.components.sendBch.payment).toEqual(
          Remote.Success(value)
        )
      })
    })
  })

  describe('bch send first step submit', () => {
    beforeAll(() => {
      coreSagas.payment.bch.create.mockClear()
      paymentMock.build.mockClear()
    })

    const saga = testSaga(firstStepSubmitClicked)
    const beforeError = 'beforeError'

    it('should select payment', () => {
      saga.next().select(S.getPayment)
    })

    it('should put loading action', () => {
      saga.next(Remote.of(paymentMock)).put(A.sendBchPaymentUpdatedLoading())
    })

    it('should create payment from state value', () => {
      saga.next()
      expect(coreSagas.payment.bch.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.bch.create).toHaveBeenCalledWith({
        payment: paymentMock,
        network: networks.bch
      })
    })

    it('should build payment', () => {
      expect(paymentMock.build).toHaveBeenCalledTimes(1)
    })

    it('should put update success action', () => {
      saga
        .next(paymentMock)
        .put(A.sendBchPaymentUpdatedSuccess(paymentMock.value()))
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
          .put(A.sendBchPaymentUpdatedFailure(error))
          .next()
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

  describe('bch send second step submit', () => {
    const saga = testSaga(secondStepSubmitClicked)
    const secondPassword = 'password'
    const description = 'description'
    const txId = 'txId'
    const beforeError = 'beforeError'
    beforeAll(() => {
      paymentMock.value.mockReturnValue({ ...value, description, txId })
      coreSagas.payment.bch.create.mockClear()
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
      expect(coreSagas.payment.bch.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.bch.create).toHaveBeenCalledWith({
        payment: paymentMock,
        network: networks.bch
      })
    })

    it('should sign payment with second password', () => {
      saga.next(secondPassword)
      expect(paymentMock.sign).toHaveBeenCalledTimes(1)
      expect(paymentMock.sign).toHaveBeenCalledWith(secondPassword)
    })

    it('should publish payment', () => {
      saga.next(paymentMock)
      expect(paymentMock.publish).toHaveBeenCalledTimes(1)
    })

    it('should put bch fetch data action', () => {
      saga.next(paymentMock).put(actions.core.data.bch.fetchData())
    })

    it('should put bch payment updated success action', () => {
      saga
        .next(paymentMock)
        .put(A.sendBchPaymentUpdatedSuccess(paymentMock.value()))
    })

    it('should set transaction note if transaction has description', () => {
      saga.next().put(actions.core.kvStore.bch.setTxNotesBch(txId, description))
    })

    it('should route to bch transactions', () => {
      saga.next().put(actions.router.push('/bch/transactions'))
    })

    it('should display success message', () => {
      saga
        .next()
        .put(
          actions.alerts.displaySuccess(C.SEND_COIN_SUCCESS, {
            coinName: 'Bitcoin Cash'
          })
        )
        .save(beforeError)
    })

    it('should log to analytics', () => {
      saga
        .next()
        .put(
          actions.analytics.logEvent([...TRANSACTION_EVENTS.SEND, 'BCH', '0'])
        )
    })

    it('should put action to close all modals', () => {
      saga.next().put(actions.modals.closeAllModals())
    })

    it('should destroy form', () => {
      saga
        .next()
        .put(actions.form.destroy(FORM))
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

      it('should log SEND_FAILURE event', () => {
        saga
          .next()
          .put(
            actions.analytics.logEvent([
              ...TRANSACTION_EVENTS.SEND_FAILURE,
              'BCH',
              error
            ])
          )
      })

      it('should display error message', () => {
        saga
          .next()
          .put(
            actions.alerts.displayError(C.SEND_COIN_ERROR, {
              coinName: 'Bitcoin Cash'
            })
          )
          .next()
          .isDone()
      })
    })

    it('should not set transaction not if payment has no description', () => {
      paymentMock.value.mockReturnValue({ ...value, description: '', txId })
      return expectSaga(secondStepSubmitClicked)
        .provide([
          [select(S.getPayment), Remote.of(paymentMock)],
          [call.fn(promptForSecondPassword), null]
        ])
        .not.put(actions.core.kvStore.bch.setTxNotesBch(txId, description))
        .run()
    })
  })
})
