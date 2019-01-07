import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { initialize } from 'redux-form'
import { path, prop } from 'ramda'
import { combineReducers } from 'redux'

import rootReducer from '../../rootReducer'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as A from './actions'
import * as S from './selectors'
import * as C from 'services/AlertService'
import { actions, actionTypes, selectors } from 'data'
import { FORM } from './model'
import sendEthSagas, { logLocation } from './sagas'
import { promptForSecondPassword } from 'services/SagaService'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
}
const coreSagas = coreSagasFactory({ api })
const networks = { eth: 1 }

describe('sendEth sagas', () => {
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
    secondStepSubmitClicked
  } = sendEthSagas({ api, networks, coreSagas })

  const paymentMock = {
    value: jest.fn(),
    init: jest.fn(() => paymentMock),
    to: jest.fn(() => paymentMock),
    amount: jest.fn(() => paymentMock),
    from: jest.fn(() => paymentMock),
    fee: jest.fn(() => paymentMock),
    fees: { regular: 10 },
    build: jest.fn(() => paymentMock),
    buildSweep: jest.fn(() => paymentMock),
    sign: jest.fn(() => paymentMock),
    publish: jest.fn(() => paymentMock),
    description: jest.fn(() => paymentMock),
    chain: jest.fn()
  }
  const value = paymentMock
  paymentMock.value.mockReturnValue(value)

  coreSagas.payment.eth.create.mockImplementation(() => {
    return paymentMock
  })

  describe('eth send form initialize', () => {
    const from = 'fromethaddress'
    const type = 'ACCOUNT'
    const payload = { from, type }

    const saga = testSaga(initialized, { payload })
    const mockAccount = Remote.of([{ addr: '0x123' }])

    const initialValues = {
      from: { addr: '0x123' },
      coin: 'ETH',
      fee: 10
    }

    const beforeEnd = 'beforeEnd'

    it('should trigger a loading action', () => {
      saga.next().put(A.sendEthPaymentUpdated(Remote.Loading))
    })

    it('should create payment', () => {
      saga.next()
      expect(coreSagas.payment.eth.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.eth.create).toHaveBeenCalledWith({
        network: networks.eth
      })
      expect(paymentMock.init).toHaveBeenCalledTimes(1)
    })

    it('should set payment from values based on payload', () => {
      saga.next(paymentMock)

      expect(paymentMock.from).toHaveBeenCalledTimes(1)
      expect(paymentMock.from).toHaveBeenCalledWith(from, type)
    })

    it('should call payment from without params if from was not passed', () => {
      const { from, ...payloadWithoutFrom } = payload
      paymentMock.from.mockClear()
      return expectSaga(initialized, { payload: payloadWithoutFrom })
        .run()
        .then(() => {
          expect(paymentMock.from).toHaveBeenCalledTimes(1)
          expect(paymentMock.from).toHaveBeenCalledWith()
        })
    })

    it('should call payment from without params if type was not passed', () => {
      const { type, ...payloadWithoutType } = payload
      paymentMock.from.mockClear()
      return expectSaga(initialized, { payload: payloadWithoutType })
        .run()
        .then(() => {
          expect(paymentMock.from).toHaveBeenCalledTimes(1)
          expect(paymentMock.from).toHaveBeenCalledWith()
        })
    })

    it('should select default account', () => {
      saga
        .next(paymentMock)
        .select(selectors.core.common.eth.getAccountBalances)
    })

    it('should initialize form with correct initial values', () => {
      saga.next(mockAccount).put(initialize(FORM, initialValues))
    })

    it('should trigger eth payment updated success action', () => {
      saga
        .next()
        .put(A.sendEthPaymentUpdated(Remote.of(value)))
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
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'sendEthInitialized',
              error
            )
          )
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
          from: {},
          coin: 'ETH',
          fee: 10
        })
      })

      it('should produce correct sendEth payment state', () => {
        expect(resultingState.components.sendEth.payment).toEqual(
          Remote.Success(value)
        )
      })
    })
  })

  describe('eth send first step submit', () => {
    beforeAll(() => {
      coreSagas.payment.eth.create.mockClear()
      paymentMock.build.mockClear()
    })

    const saga = testSaga(firstStepSubmitClicked)

    const beforeError = 'beforeError'

    it('should select payment', () => {
      saga.next().select(S.getPayment)
    })

    it('should put loading action', () => {
      saga
        .next(Remote.of(paymentMock))
        .put(A.sendEthPaymentUpdated(Remote.Loading))
    })

    it('should create payment from state value', () => {
      saga.next()
      expect(coreSagas.payment.eth.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.eth.create).toHaveBeenCalledWith({
        payment: paymentMock,
        network: networks.eth
      })
    })

    it('should build payment', () => {
      expect(paymentMock.build).toHaveBeenCalledTimes(1)
    })

    it('should put update success action', () => {
      saga
        .next(paymentMock)
        .put(A.sendEthPaymentUpdated(Remote.of(paymentMock.value())))
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

  describe('eth send second step submit', () => {
    const saga = testSaga(secondStepSubmitClicked)
    const secondPassword = 'password'
    const description = 'description'
    const txId = 'txId'
    const beforeError = 'beforeError'
    const from = { address: 'address' }
    beforeAll(() => {
      paymentMock.value.mockReturnValue({ ...value, description, txId, from })
      coreSagas.payment.eth.create.mockClear()
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
      expect(coreSagas.payment.eth.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.eth.create).toHaveBeenCalledWith({
        payment: paymentMock,
        network: networks.eth
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

    it('should put eth payment updated success action', () => {
      saga
        .next(paymentMock)
        .put(A.sendEthPaymentUpdated(Remote.of(paymentMock.value())))
    })

    it('should update latest transaction time', () => {
      saga
        .next()
        .put(
          actions.core.kvStore.ethereum.setLatestTxTimestampEthereum(Date.now())
        )
    })

    it('should wait until fetch metadata success action is published', () => {
      saga
        .next()
        .take(actionTypes.core.kvStore.ethereum.FETCH_METADATA_ETHEREUM_SUCCESS)
    })

    it('should update latest transaction', () => {
      saga
        .next(paymentMock)
        .put(actions.core.kvStore.ethereum.setLatestTxEthereum(txId))
        .save(beforeError)
    })

    it('should set transaction note if payment has description', () => {
      saga
        .next()
        .take(actionTypes.core.kvStore.ethereum.FETCH_METADATA_ETHEREUM_SUCCESS)
        .next()
        .put(
          actions.core.kvStore.ethereum.setTxNotesEthereum(txId, description)
        )
    })

    it('should route to eth tx list', () => {
      saga.next().put(actions.router.push('/eth/transactions'))
    })

    it('should display succcess message', () => {
      saga.next().put(actions.alerts.displaySuccess(C.SEND_ETH_SUCCESS))
    })

    it('should destroy form', () => {
      saga.next().put(actions.form.destroy(FORM))
    })

    it('should put action to close all modals', () => {
      saga
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

      it('should display error message', () => {
        saga
          .next()
          .put(actions.alerts.displayError(C.SEND_ETH_ERROR))
          .next()
      })
    })
  })
})
