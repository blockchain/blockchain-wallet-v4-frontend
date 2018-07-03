import { select } from 'redux-saga/effects'

import { expectSaga, testSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as actions from '../../actions'
import * as coinifyActions from './actions.js'
import * as selectors from '../../selectors.js'

import coinifySagas, { logLocation } from './sagas'
import * as C from 'services/AlertService'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory()

describe('coinifySagas', () => {
  beforeAll(() => {
    Math.random = () => 0.5
  })

  describe('coinify signup', () => {
    let { coinifySignup } = coinifySagas({
      coreSagas
    })

    const data = {
      payload: {
        country: 'FR'
      }
    }

    let saga = testSaga(coinifySignup, data)
    const beforeDetermine = 'beforeDetermine'

    it('should call core signup with the payload', () => {
      saga.next().call(coreSagas.data.coinify.signup, data.payload)
    })

    it('should select the profile', () => {
      saga.next().select(selectors.core.data.coinify.getProfile()).save(beforeDetermine)
    })

    it('should go to ISX step if no error', () => {
      const profile = { id: 1 }
      saga
        .next(profile)
        .call(coreSagas.data.coinify.triggerKYC)
        .next()
        .put(coinifyActions.coinifyNextStep('isx'))
    })

    it('should handle an error', () => {
      const errorProfile = { error: '{"error": "signup_error"}' }
      saga
        .restore(beforeDetermine)
        .next(errorProfile)
        .put(coinifyActions.coinifySignupFailure(JSON.parse(errorProfile.error)))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log and display an error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'coinifySignup', error))
          .next()
          .put(actions.alerts.displayError(C.COINIFY_SIGNUP_ERROR))
      })
    })
  })

  describe('triggerKYC', () => {
    let { triggerKYC } = coinifySagas({
      coreSagas
    })

    let saga = testSaga(triggerKYC)

    it('should call core triggerKYC', () => {
      saga.next().call(coreSagas.data.coinify.triggerKYC)
    })

    it('should go to the next step', () => {
      saga.next().put(coinifyActions.coinifyNextCheckoutStep('isx'))
    })

    it('should handle an error', () => {
      const error = new Error('ERROR')
      saga
        .restart()
        .next()
        .throw(error)
        .put(actions.logs.logErrorMessage(logLocation, 'triggerKYC', error))
    })
  })

  describe('fromISX', () => {
    let { fromISX } = coinifySagas({
      coreSagas
    })

    const action = {
      payload: {
        status: 'complete'
      }
    }

    it('should call signupComplete if modal type is CoinifyExchangeData', () => {
      const modals = [{ type: 'CoinifyExchangeData' }]
      return expectSaga(fromISX, action)
        .provide([
          [select(selectors.modals.getModals), modals]
        ])
        .put(coinifyActions.coinifySignupComplete())
        .run()
    })

    it('should change the form if constructor is not Trade', () => {
      const modals = [{ type: 'other' }]
      const trade = { data: { constructor: { name: 'ISX' } } }
      return expectSaga(fromISX, action)
        .provide([
          [select(selectors.modals.getModals), modals],
          [select(selectors.core.data.coinify.getTrade), trade]
        ])
        .put(actions.form.change('buySellTabStatus', 'status', 'buy'))
        .run()
    })

    it('should change the form to order history', () => {
      const modals = [{ type: 'other' }]
      const trade = { data: { constructor: { name: 'Trade' } } }
      return expectSaga(fromISX, action)
        .provide([
          [select(selectors.modals.getModals), modals],
          [select(selectors.core.data.coinify.getTrade), trade]
        ])
        .put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
        .run()
    })

  })

  describe('openKYC', () => {
    let { openKYC } = coinifySagas({
      coreSagas
    })

    const data = {
      payload: {
        kyc: {
          id: 1,
          state: 'pending'
        }
      }
    }

    it('should select a kyc', () => {
      const kyc = { id: 1, state: 'pending' }
      let dataKyc = data.payload
      return expectSaga(openKYC, data)
        .provide([
          [select(selectors.core.data.coinify.getKyc), Remote.of(kyc)]
        ])
        .call(coreSagas.data.coinify.kycAsTrade, { kyc: dataKyc })
        .run()
    })
  })

  describe('finishTrade', () => {
    let { finishTrade } = coinifySagas({
      coreSagas
    })

    const data = {
      payload: { state: 'awaiting_transfer_in', medium: 'card' }
    }

    let saga = testSaga(finishTrade, data)

    it('should call handleTradeSuccess if trade state is awaiting_trasnfer_in', () => {
      saga.next(data.payload).put(actions.core.data.coinify.handleTradeSuccess(data.payload))
    })

    it('should call core kycAsTrade', () => {
      saga.next(data.payload).call(coreSagas.data.coinify.kycAsTrade, { kyc: data.payload })
    })

    it('should go to next step isx', () => {
      saga.next().put(coinifyActions.coinifyNextCheckoutStep('isx'))
    })
  })

  describe('finishTrade with bank', () => {
    let { finishTrade } = coinifySagas({
      coreSagas
    })
    const data = {
      payload: { state: 'awaiting_transfer_in', medium: 'bank' }
    }

    let saga = testSaga(finishTrade, data)

    it('should call handleTradeSuccess if trade state is awaiting_trasnfer_in', () => {
      const tradeToFinish = data.payload
      saga.next(tradeToFinish).put(actions.core.data.coinify.handleTradeSuccess(tradeToFinish))
    })

    it('should open the trade details modal if bank', () => {
      const tradeToFinish = data.payload
      saga.next(tradeToFinish).put(actions.modals.showModal('CoinifyTradeDetails', { trade: tradeToFinish }))
    })
  })

  describe('coinify buy', () => {
    const { buy, prepareAddress } = coinifySagas({
      coreSagas
    })
    const quoteId = '12345'
    const quoteCurrency = 'EUR'
    const quoteAmount = 100

    const payload = {
      quoteId,
      quoteCurrency,
      quoteAmount
    }

    const saga = testSaga(buy, payload)
    const beforeResponse = 'beforeResponse'

    const nextAddressData = {
      address: '1masdfasdflkjo',
      index: 0,
      accountIndex: 0
    }

    it('should call prepareAddress', () => {
      saga.next().call(prepareAddress)
    })

    it('should call buy', () => {
      saga.next(nextAddressData).call(coreSagas.data.coinify.buy, payload, nextAddressData).save(beforeResponse)
    })

    it('should go to bank details if medium is bank', () => {
      const buyTrade = { medium: 'bank' }
      saga.next(buyTrade).put(coinifyActions.coinifyNextCheckoutStep('bankTransferDetails'))
    })

    it('should handle a credit card trade', () => {
      const buyTrade = { medium: 'card' }
      saga
        .restore(beforeResponse)
        .next(buyTrade)
        .put(coinifyActions.coinifyNextCheckoutStep('isx'))
        .next()
        .put(coinifyActions.coinifyNotAsked())
    })
  })
})
