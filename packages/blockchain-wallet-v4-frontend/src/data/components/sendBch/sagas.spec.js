import { select } from 'redux-saga/effects'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { initialize } from 'redux-form'
import { prop } from 'ramda'
import { call } from 'redux-saga-test-plan/matchers'

import rootReducer from '../../rootReducer'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as A from './actions'
import * as S from './selectors'
import * as C from 'services/AlertService'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import sendBchSagas, { logLocation, bchDefaultFee } from './sagas'
import { promptForSecondPassword } from 'services/SagaService'
import settings from 'config'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
}
const coreSagas = coreSagasFactory({ api })

describe('sendBch sagas', () => {
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
  const { initialized, firstStepSubmitClicked,
    secondStepSubmitClicked } = sendBchSagas({ api, coreSagas })

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

  describe('bch send form intialize', () => {
    const to = 'bchaddress'
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
      coin: 'BCH',
      from: defaultAccount
    }

    const beforeEnd = 'beforeEnd'

    it('should trigger a loading action', () => {
      saga.next().put(A.sendBchPaymentUpdated(Remote.Loading))
    })

    it('should create payment', () => {
      saga.next()
      expect(coreSagas.payment.bch.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.bch.create).toHaveBeenCalledWith({ network: settings.NETWORK_BCH })
      expect(paymentMock.init).toHaveBeenCalledTimes(1)
    })

    it('should select accounts', () => {
      saga.next(paymentMock).select(selectors.core.common.bch.getAccountsBalances)
    })

    it('should select defaultIndex', () => {
      saga.next(accountsRStub).select(selectors.core.kvStore.bch.getDefaultAccountIndex)
    })

    it('should update payment from to defaultIndex', () => {
      saga.next(Remote.of(defaultIndex))

      expect(paymentMock.from).toHaveBeenCalledTimes(1)
      expect(paymentMock.from).toHaveBeenCalledWith(defaultIndex)
    })

    it('should update payment fee from value', () => {
      saga.next(paymentMock)

      expect(paymentMock.fee).toHaveBeenCalledTimes(1)
      expect(paymentMock.fee).toHaveBeenCalledWith(bchDefaultFee)
    })

    it('should initialize sendBch form with correct values', () => {
      saga.next(paymentMock).put(initialize('sendBch', initialValues))
    })

    it('should trigger bch payment updated success action', () => {
      saga
        .next()
        .put(A.sendBchPaymentUpdated(Remote.of(value)))
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
          .put(actions.logs.logErrorMessage(logLocation, 'sendBchInitialized', error))
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
          .withReducer(rootReducer)
          .provide([
            [select(selectors.core.common.bch.getAccountsBalances), stubAccounts],
            [select(selectors.core.kvStore.bch.getDefaultAccountIndex), Remote.of(defaultIndex)]
          ])
          .run()
          .then(prop('storeState'))
      })

      it('should produce correct form state', () => {
        expect(resultingState.form.sendBch.initial).toEqual(resultingState.form.sendBch.values)
        expect(resultingState.form.sendBch.initial).toEqual({
          coin: 'BCH',
          from: defaultAccount
        })
      })

      it('should produce correct sendBch payment state', () => {
        expect(resultingState.components.sendBch.payment)
          .toEqual(Remote.Success(value))
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
      saga.next(Remote.of(paymentMock)).put(A.sendBchPaymentUpdated(Remote.Loading))
    })

    it('should create payment from state value', () => {
      saga.next()
      expect(coreSagas.payment.bch.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.bch.create).toHaveBeenCalledWith({
        payment: paymentMock,
        network: settings.NETWORK_BCH
      })
    })

    it('should build payment', () => {
      expect(paymentMock.build).toHaveBeenCalledTimes(1)
    })

    it('should put update success action', () => {
      saga
        .next(paymentMock)
        .put(A.sendBchPaymentUpdated(Remote.of(paymentMock.value())))
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
          .put(actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', error))
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
        network: settings.NETWORK_BCH
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

    it('should put bch payment updated success action', () => {
      saga.next(paymentMock).put(A.sendBchPaymentUpdated(Remote.of(paymentMock.value())))
    })

    it('should set transaction note if transaction has description', () => {
      saga
        .next()
        .put(actions.core.kvStore.bch.setTxNotesBch(txId, description))
    })

    it('should put bch fetch data action', () => {
      saga.next(paymentMock)
        .put(actions.core.data.bch.fetchData())
    })

    it('should route to bch transactions', () => {
      saga.next().put(actions.router.push('/bch/transactions'))
    })

    it('should display succcess message', () => {
      saga.next()
        .put(actions.alerts.displaySuccess(C.SEND_BCH_SUCCESS))
        .save(beforeError)
        .next()
        .isDone()
    })

    describe('error handling', () => {
      const error = {}
      it('should log error', () => {
        saga
          .restore(beforeError)
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'secondStepSubmitClicked', error))
      })

      it('should display success message', () => {
        saga
          .next()
          .put(actions.alerts.displayError(C.SEND_BCH_ERROR))
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
