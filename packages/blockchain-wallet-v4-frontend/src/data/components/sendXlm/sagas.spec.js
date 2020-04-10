import * as A from './actions'
import * as C from 'services/AlertService'
import * as S from './selectors'
import * as StellarSdk from 'stellar-sdk'
import { actions, model, selectors } from 'data'
import { combineReducers } from 'redux'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { FORM } from './model'
import { initialize, touch } from 'redux-form'
import { path, prop } from 'ramda'
import { promptForSecondPassword } from 'services/SagaService'
import rootReducer from '../../rootReducer'
import sendXlmSagas, { INITIAL_MEMO_TYPE, logLocation } from './sagas.ts'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
}
const coreSagas = coreSagasFactory({ api })

const STUB_ADDRESS = StellarSdk.Keypair.random().publicKey()
const STUB_FEE = 100
const { TRANSACTION_EVENTS } = model.analytics

describe('sendXlm sagas', () => {
  // Mocking Math.random() to have identical popup ids for action testing
  const originalMath = Object.create(Math)
  const originalDate = Object.create(Date)
  const currentDate = Date.now()
  let pushStateSpy
  let locationReloadSpy
  beforeAll(() => {
    Math.random = () => 0.5
    Date.now = () => currentDate
    pushStateSpy = jest
      .spyOn(window.history, 'pushState')
      .mockImplementation(() => {})
    locationReloadSpy = jest
      .spyOn(window.location, 'reload')
      .mockImplementation(() => {})
  })
  afterAll(() => {
    global.Math = originalMath
    global.Date = originalDate
    pushStateSpy.restore()
    locationReloadSpy.restore()
  })
  const {
    initialized,
    firstStepSubmitClicked,
    secondStepSubmitClicked,
    setFrom
  } = sendXlmSagas({ coreSagas })

  const paymentMock = {
    value: jest.fn(),
    init: jest.fn(() => paymentMock),
    to: jest.fn(() => paymentMock),
    amount: 10,
    from: jest.fn(() => paymentMock),
    fee: jest.fn(() => paymentMock),
    build: jest.fn(() => paymentMock),
    buildSweep: jest.fn(() => paymentMock),
    sign: jest.fn(() => paymentMock),
    publish: jest.fn(() => paymentMock),
    description: jest.fn(() => paymentMock),
    memo: jest.fn(() => paymentMock),
    memoType: jest.fn(() => paymentMock),
    chain: jest.fn()
  }
  const value = { ...paymentMock, fee: STUB_FEE }
  paymentMock.value.mockReturnValue(value)

  coreSagas.payment.xlm.create.mockImplementation(() => {
    return paymentMock
  })

  describe('xlm send form initialize', () => {
    const from = 'fromxlmaddress'
    const type = 'ACCOUNT'
    const payload = { from, type }

    const saga = testSaga(initialized, { payload })
    const mockAccount = Remote.of([{ addr: STUB_ADDRESS }])

    const initialValues = {
      from: { addr: STUB_ADDRESS },
      coin: 'XLM',
      fee: STUB_FEE,
      memoType: INITIAL_MEMO_TYPE,
      memo: undefined,
      to: null
    }

    const beforeEnd = 'beforeEnd'

    it('should trigger a loading action', () => {
      saga.next().put(A.paymentUpdatedLoading())
    })

    it('should fetch exchange addresses', () => {
      saga
        .next()
        .put(actions.components.send.fetchPaymentsAccountExchange('XLM'))
    })

    it('should create payment', () => {
      saga.next().call(paymentMock.init)
      expect(coreSagas.payment.xlm.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.xlm.create).toHaveBeenCalledWith()
    })

    it('should set initial memo type', () => {
      saga.next(paymentMock).call(paymentMock.memoType, INITIAL_MEMO_TYPE)
    })

    it('should call setFrom based on payload', () => {
      saga.next(paymentMock).call(setFrom, paymentMock, from, type)
    })

    it('should select default account', () => {
      saga
        .next(paymentMock)
        .select(selectors.core.common.xlm.getAccountBalances)
    })

    it('should initialize form with correct initial values', () => {
      saga.next(mockAccount).put(initialize(FORM, initialValues))
    })

    it('should touch memo and memoType form fields', () => {
      saga.next().put(touch(FORM, 'memo', 'memoType'))
    })

    it('should trigger xlm payment updated success action', () => {
      saga
        .next()
        .put(A.paymentUpdatedSuccess(value))
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
          .put(actions.logs.logErrorMessage(logLocation, 'initialized', error))
          .next()
          .isDone()
      })
    })

    describe('state change', () => {
      let resultingState = {}

      beforeEach(async () => {
        resultingState = await expectSaga(initialized, { payload })
          .withReducer(combineReducers(rootReducer))
          .run()
          .then(prop('storeState'))
      })

      it('should produce correct form state', () => {
        const form = path(FORM.split('.'), resultingState.form)
        expect(form.initial).toEqual(form.values)
        expect(form.initial).toEqual({
          memo: undefined,
          to: null,
          from: {},
          coin: 'XLM',
          fee: STUB_FEE,
          memoType: INITIAL_MEMO_TYPE
        })
      })

      it('should produce correct sendXlm payment state', () => {
        expect(resultingState.components.sendXlm.payment).toEqual(
          Remote.Success(value)
        )
      })
    })
  })

  describe('xlm send first step submit', () => {
    beforeAll(() => {
      coreSagas.payment.xlm.create.mockClear()
      paymentMock.build.mockClear()
    })

    const saga = testSaga(firstStepSubmitClicked)

    const beforeError = 'beforeError'

    it('should select payment', () => {
      saga.next().select(S.getPayment)
    })

    it('should put loading action', () => {
      saga.next(Remote.of(paymentMock)).put(A.paymentUpdatedLoading())
    })

    it('should create payment from state value', () => {
      saga.next().call(coreSagas.payment.xlm.create, { payment: paymentMock })
    })

    it('should build payment', () => {
      saga.next(paymentMock).call(paymentMock.build)
    })

    it('should put update success action', () => {
      saga
        .next(paymentMock)
        .put(A.paymentUpdatedSuccess(paymentMock.value()))
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
          .put(A.paymentUpdatedFailure(error))
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

  describe('xlm send second step submit', () => {
    const saga = testSaga(secondStepSubmitClicked)
    const secondPassword = 'password'
    const description = 'description'
    const txId = 'txId'
    const beforeError = 'beforeError'
    const from = { address: 'address' }
    beforeAll(() => {
      paymentMock.value.mockReturnValue({ ...value, description, txId, from })
      coreSagas.payment.xlm.create.mockClear()
      paymentMock.sign.mockClear()
      paymentMock.publish.mockClear()
    })

    it('should put start submit action', () => {
      saga.next().put(actions.form.startSubmit(FORM))
    })

    it('should select payment', () => {
      saga.next().select(S.getPayment)
    })

    it('should create payment from state value', () => {
      saga
        .next(Remote.of(paymentMock))
        .call(coreSagas.payment.xlm.create, { payment: paymentMock })
    })

    it('should prompt for second password', () => {
      saga.next(paymentMock).call(promptForSecondPassword)
    })

    it('should sign payment with second passowrd', () => {
      saga.next(secondPassword).call(paymentMock.sign, secondPassword)
    })

    it('should publish payment', () => {
      saga.next(paymentMock).call(paymentMock.publish)
    })

    it('should update xlm data', () => {
      saga.next(paymentMock).put(actions.core.data.xlm.fetchData())
    })

    it('should put xlm payment updated success action', () => {
      saga.next().put(A.paymentUpdatedSuccess(paymentMock.value()))
    })

    it('should set transaction note if payment has description', () => {
      saga.next().put(actions.core.kvStore.xlm.setTxNotesXlm(txId, description))
    })

    it('should route to xlm tx list', () => {
      saga.next().put(actions.router.push('/xlm/transactions'))
    })

    it('should display success message', () => {
      saga.next().put(
        actions.alerts.displaySuccess(C.SEND_COIN_SUCCESS, {
          coinName: 'Stellar'
        })
      )
    })

    it('should destroy form', () => {
      saga.next().put(actions.form.destroy(FORM))
    })

    it('should log to analytics', () => {
      saga
        .next()
        .put(
          actions.analytics.logEvent([
            ...TRANSACTION_EVENTS.SEND,
            'XLM',
            '0.000001'
          ])
        )
    })

    it('should put action to close all modals', () => {
      saga
        .save(beforeError)
        .next()
        .put(actions.modals.closeAllModals())
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
              'XLM',
              error
            ])
          )
      })

      it('should display error message', () => {
        saga
          .next()
          .put(
            actions.alerts.displayError(C.SEND_COIN_ERROR, {
              coinName: 'Stellar'
            })
          )
          .next()
      })
    })
  })

  describe('setFrom', () => {
    const from = 'fromxlmaddress'
    const type = 'ACCOUNT'
    it('should update payment from and remove noAccount form', () =>
      expectSaga(setFrom, paymentMock, from, type)
        .call(paymentMock.from, from, type)
        .put(A.showNoAccountForm(false))
        .returns(paymentMock)
        .run())

    it('should show noAccount form if from throw `Account does not exist` error', () => {
      paymentMock.from.mockRejectedValue(new Error('Account does not exist'))
      return expectSaga(setFrom, paymentMock, from, type)
        .call(paymentMock.from, from, type)
        .put(A.showNoAccountForm(true))
        .returns(paymentMock)
        .run()
    })

    it('should rethrow on other error', () => {
      const error = new Error('other error')
      paymentMock.from.mockRejectedValue(error)
      return expect(
        expectSaga(setFrom, paymentMock, from, type)
          .call(paymentMock.from, from, type)
          .run()
      ).rejects.toThrowError(error)
    })
  })
})
