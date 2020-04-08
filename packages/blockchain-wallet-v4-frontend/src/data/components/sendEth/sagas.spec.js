import * as A from './actions'
import * as C from 'services/AlertService'
import * as S from './selectors'
import { actions, actionTypes, model, selectors } from 'data'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import { FORM } from './model'
import { initialize } from 'redux-form'
import { promptForSecondPassword } from 'services/SagaService'
import { testSaga } from 'redux-saga-test-plan'
import sendEthSagas, { logLocation } from './sagas.ts'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
}
const coreSagas = coreSagasFactory({ api })
const networks = { eth: 1 }
const { TRANSACTION_EVENTS } = model.analytics

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
    amount: 0,
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
    const payload = 'ETH'
    const saga = testSaga(initialized, { payload })
    const mockAccount = Remote.of([{ addr: '0x123' }])
    const beforeEnd = 'beforeEnd'
    const initialValues = {
      coin: 'ETH',
      fee: 10,
      from: { addr: '0x123' }
    }

    it('should select erc20 list', () => {
      saga.next().select(selectors.core.walletOptions.getErc20CoinList)
    })

    it('should trigger a loading action', () => {
      saga.next(Remote.of([])).put(A.sendEthPaymentUpdatedLoading())
    })

    it('should fetch exchange addresses', () => {
      saga
        .next()
        .put(actions.components.send.fetchPaymentsAccountExchange('ETH'))
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
        .put(A.sendEthPaymentUpdatedSuccess(value))
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
  })

  describe('eth send first step submit', () => {
    beforeAll(() => {
      coreSagas.payment.eth.create.mockClear()
      paymentMock.build.mockClear()
    })

    const saga = testSaga(firstStepSubmitClicked)
    const beforeError = 'beforeError'

    it('should select payment', () => {
      saga.next({ coin: 'ETH' }).select(S.getPayment)
    })

    it('should put loading action', () => {
      saga.next(Remote.of(paymentMock)).put(A.sendEthPaymentUpdatedLoading())
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
        .put(A.sendEthPaymentUpdatedSuccess(paymentMock.value()))
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
          .put(A.sendEthPaymentUpdatedFailure(error))
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

  describe('eth send second step submit', () => {
    const saga = testSaga(secondStepSubmitClicked)
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

    it('should fetch coin model', () => {
      saga
        .next()
        .next({ coin: 'ETH' })
        .select(selectors.core.walletOptions.getCoinModel, 'ETH')
    })

    it('should put start submit action', () => {
      saga
        .next(
          Remote.of({
            displayName: 'Ethereum',
            txListAppRoute: '/eth/transactions'
          })
        )
        .put(actions.form.startSubmit(FORM))
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

    it('should publish payment', () => {
      saga.next().next(paymentMock)
      expect(paymentMock.publish).toHaveBeenCalledTimes(1)
    })

    it('should put eth payment updated success action', () => {
      saga
        .next(paymentMock)
        .put(A.sendEthPaymentUpdatedSuccess(paymentMock.value()))
    })

    it('should update latest transaction time', () => {
      saga
        .next()
        .put(actions.core.kvStore.eth.setLatestTxTimestampEth(Date.now()))
    })

    it('should wait until fetch metadata success action is published', () => {
      saga.next().take(actionTypes.core.kvStore.eth.FETCH_METADATA_ETH_SUCCESS)
    })

    it('should update latest transaction', () => {
      saga
        .next(paymentMock)
        .put(actions.core.kvStore.eth.setLatestTxEth(txId))
        .save(beforeError)
    })

    it('should set transaction note if payment has description', () => {
      saga
        .next()
        .take(actionTypes.core.kvStore.eth.FETCH_METADATA_ETH_SUCCESS)
        .next()
        .put(actions.core.kvStore.eth.setTxNotesEth(txId, description))
    })

    it('should route to eth tx list', () => {
      saga.next().put(actions.router.push('/eth/transactions'))
    })

    it('should display success message', () => {
      saga.next().put(
        actions.alerts.displaySuccess(C.SEND_COIN_SUCCESS, {
          coinName: 'Ethereum'
        })
      )
    })

    it('should log to analytics', () => {
      saga
        .next()
        .put(
          actions.analytics.logEvent([...TRANSACTION_EVENTS.SEND, 'ETH', '0'])
        )
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

      it('should log SEND_FAILURE event', () => {
        saga
          .next(false)
          .next()
          .put(
            actions.analytics.logEvent([
              ...TRANSACTION_EVENTS.SEND_FAILURE,
              'ETH',
              error
            ])
          )
      })

      it('should display error message', () => {
        saga
          .next()
          .put(
            actions.alerts.displayError(C.SEND_COIN_ERROR, {
              coinName: 'Ethereum'
            })
          )
          .next()
      })
    })
  })
})
