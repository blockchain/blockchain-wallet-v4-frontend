import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { initialize } from 'redux-form'
import { prop } from 'ramda'

import rootReducer from '../../rootReducer'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as A from './actions'
import * as S from './selectors'
import * as C from 'services/AlertService'
import * as actions from '../../actions'
import * as actionTypes from '../../actionTypes'
import sendEthSagas, { logLocation } from './sagas'
import { promptForSecondPassword } from 'services/SagaService'
import settings from 'config'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
}
const coreSagas = coreSagasFactory({ api })

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
  } = sendEthSagas({ api, coreSagas })

  const value = {}
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

  coreSagas.payment.eth.create.mockImplementation(() => {
    return paymentMock
  })

  describe('eth send form intialize', () => {
    const from = 'fromethaddress'
    const type = 'ACCOUNT'
    const payload = { from, type }

    const saga = testSaga(initialized, { payload })

    const initialValues = {
      coin: 'ETH'
    }

    const beforeEnd = 'beforeEnd'

    it('should trigger a loading action', () => {
      saga.next().put(A.sendEthPaymentUpdated(Remote.Loading))
    })

    it('should create payment', () => {
      saga.next()
      expect(coreSagas.payment.eth.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.eth.create).toHaveBeenCalledWith({
        network: settings.NETWORK_ETHEREUM
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

    it('should initializr form with correct initial values', () => {
      saga.next(paymentMock).put(initialize('sendEth', initialValues))
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
          .withReducer(rootReducer)
          .run()
          .then(prop('storeState'))
      })

      it('should produce correct form state', () => {
        expect(resultingState.form.sendEth.initial).toEqual(
          resultingState.form.sendEth.values
        )
        expect(resultingState.form.sendEth.initial).toEqual({
          coin: 'ETH'
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
        network: settings.NETWORK_ETHEREUM
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
    beforeAll(() => {
      paymentMock.value.mockReturnValue({ ...value, description, txId })
      coreSagas.payment.eth.create.mockClear()
      paymentMock.sign.mockClear()
      paymentMock.publish.mockClear()
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
        network: settings.NETWORK_ETHEREUM
      })
    })

    it('should put action to close all modals', () => {
      saga.next(secondPassword).put(actions.modals.closeAllModals())
    })

    it('should sign payment with second passowrd', () => {
      saga.next()
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
    })

    it('should display succcess message', () => {
      saga
        .next()
        .put(actions.alerts.displaySuccess(C.SEND_ETH_SUCCESS))
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
        .next()
        .isDone()
    })

    it('should not set transaction note if payment has no description', () => {
      paymentMock.value.mockReturnValue({ ...value, description: '', txId })
      return expectSaga(secondStepSubmitClicked)
        .not.put(
          actions.core.kvStore.ethereum.setTxNotesEthereum(txId, description)
        )
        .run()
    })

    describe('error handling', () => {
      const error = {}
      it('should log error', () => {
        saga
          .restore(beforeError)
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'secondStepSubmitClicked',
              error
            )
          )
      })

      it('should display success message', () => {
        saga
          .next()
          .put(actions.alerts.displayError(C.SEND_ETH_ERROR))
          .next()
          .isDone()
      })
    })
  })
})
