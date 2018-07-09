import { select } from 'redux-saga/effects'
import { promptForSecondPassword } from 'services/SagaService'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as actions from '../../actions'
import * as coinifyActions from './actions.js'
import * as selectors from '../../selectors.js'
import * as sendBtcSelectors from '../../components/sendBtc/selectors'
import settings from 'config'
import coinifySagas, { logLocation } from './sagas'
import * as C from 'services/AlertService'
import * as sendBtcActions from '../../components/sendBtc/actions'
import { merge } from 'ramda'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory()

describe('coinifySagas', () => {
  beforeAll(() => {
    Math.random = () => 0.5
  })

  const mockedLimits = {
    data: {
      bank: {
        inRemaining: { EUR: 150, USD: 150, GBP: 150, DKK: 150 },
        minimumInAmounts: { EUR: 0, USD: 0, GBP: 0, DKK: 0 }
      },
      card: {
        inRemaining: { EUR: 150, USD: 150, GBP: 150, DKK: 150 },
        minimumInAmounts: { EUR: 0, USD: 0, GBP: 0, DKK: 0 }
      },
      blockchain: {
        inRemaining: { BTC: 0 },
        minimumInAmounts: { BTC: 0 }
      }
    }
  }
  const tradeReceiveAddress = '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC'
  const secondPassword = 'secondPassword'
  const mockSellTrade = {
    sendAmount: 500,
    receiveAddress: tradeReceiveAddress,
    id: 56789,
    transferIn: {
      details: {
        account: tradeReceiveAddress
      }
    }
  }
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

  describe('coinify prepareAddress', () => {
    const { prepareAddress } = coinifySagas({
      coreSagas
    })

    const saga = testSaga(prepareAddress)

    it('should select the state', () => {
      saga.next().select()
    })
  })

  describe('initialized buy', () => {
    let { initialized } = coinifySagas({
      coreSagas
    })
    const action = {
      payload: {
        type: 'buy'
      }
    }

    let saga = testSaga(initialized, action)

    it('should select the level', () => {
      saga.next().select(selectors.core.data.coinify.getLevel)
    })

    it('should intialize if type is buy', () => {
      const level = { currency: 'EUR' }
      const initialValues = {
        leftVal: '',
        rightVal: '',
        currency: level.currency
      }
      saga.next(Remote.of(level)).put(actions.form.initialize('coinifyCheckoutBuy', initialValues))
    })

    it('should fetch a rate quote', () => {
      const currency = 'EUR'
      const type = 'buy'
      saga.next().put(actions.core.data.coinify.fetchRateQuote(currency, type))
    })

    it('should set coinifyCheckoutError', () => {
      saga.next().put(coinifyActions.setCoinifyCheckoutError(false))
    })

    it('should set busy on', () => {
      saga.next().put(coinifyActions.coinifyCheckoutBusyOn())
    })
  })

  describe('initialized sell', () => {
    let { initialized } = coinifySagas({
      coreSagas
    })
    const action = {
      payload: {
        type: 'sell'
      }
    }

    let saga = testSaga(initialized, action)

    it('should select the level', () => {
      saga.next().select(selectors.core.data.coinify.getLevel)
    })

    it('should intialize coinifyCheckoutSell', () => {
      const level = { currency: 'EUR' }
      const initialValues = {
        leftVal: '',
        rightVal: '',
        currency: level.currency
      }
      saga.next(Remote.of(level)).put(actions.form.initialize('coinifyCheckoutSell', initialValues))
    })

    it('should select limits', () => {
      saga.next().select(selectors.core.data.coinify.getLimits)
    })

    it('should get the default account index', () => {
      saga.next().select(selectors.core.wallet.getDefaultAccountIndex)
    })
  })

  describe('handle fiat (leftVal) change - Buy', () => {
    let { handleChange } = coinifySagas({
      coreSagas
    })
    const action = {
      payload: 100,
      meta: {
        form: 'coinifyCheckoutBuy',
        field: 'leftVal'
      }
    }

    let saga = testSaga(handleChange, action)

    it('should trigger busy state', () => {
      saga.next().put(coinifyActions.coinifyCheckoutBusyOn())
    })

    it('should select the limits', () => {
      saga.next().select(selectors.core.data.coinify.getLimits)
    })

    it('should select the form values', () => {
      const limits = mockedLimits
      saga.next(limits)
    })

    it('should clear coinifyCheckoutError', () => {
      const values = { currency: 'EUR' }
      saga.next(values).put(coinifyActions.clearCoinifyCheckoutError())
    })

    it('should fetch a quote', () => {
      saga.next().call(coreSagas.data.coinify.fetchQuote,
        {
          quote: {
            amount: action.payload * 100,
            baseCurrency: 'EUR',
            quoteCurrency: 'BTC',
            type: 'buy'
          }
        }
      )
    })

    it('should initialize the form with the new values', () => {
      const leftResult = { quoteAmount: 200000 }
      saga.next(leftResult).put(actions.form.initialize('coinifyCheckoutBuy', merge({ currency: 'EUR' }, { 'rightVal': leftResult.quoteAmount / 1e8 })))
    })

    it('should trigger busy off', () => {
      saga.next().put(coinifyActions.coinifyCheckoutBusyOff())
    })
  })

  fdescribe('handle fiat (leftVal) change - Sell', () => {
    let { handleChange } = coinifySagas({
      coreSagas
    })
    const action = {
      payload: 100,
      meta: {
        form: 'coinifyCheckoutSell',
        field: 'leftVal'
      }
    }

    let saga = testSaga(handleChange, action)

    it('should trigger busy state', () => {
      saga.next().put(coinifyActions.coinifyCheckoutBusyOn())
    })

    it('should select the limits', () => {
      saga.next().select(selectors.core.data.coinify.getLimits)
    })

    it('should select the form values', () => {
      const limits = mockedLimits
      saga.next(limits)
    })

    // it('should clear coinifyCheckoutError', () => {
    //   const values = { currency: 'EUR' }
    //   saga.next(values).put(coinifyActions.clearCoinifyCheckoutError())
    // })

    it('should fetch a quote', () => {
      const values = { currency: 'EUR' }
      saga.next(values).call(coreSagas.data.coinify.fetchQuote,
        {
          quote: {
            amount: action.payload * 100,
            baseCurrency: 'EUR',
            quoteCurrency: 'BTC',
            type: 'sell'
          }
        }
      )
    })

    // it('should initialize the form with the new values', () => {
    //   const leftResult = { quoteAmount: 200000 }
    //   saga.next(leftResult).put(actions.form.initialize('coinifyCheckoutBuy', merge({ currency: 'EUR' }, { 'rightVal': leftResult.quoteAmount / 1e8 })))
    // })

    // it('should trigger busy off', () => {
    //   saga.next().put(coinifyActions.coinifyCheckoutBusyOff())
    // })
  })

  describe('cancelISX', () => {
    let { cancelISX } = coinifySagas({
      coreSagas
    })

    let saga = testSaga(cancelISX)

    it('should select modals', () => {
      saga.next().select(selectors.modals.getModals)
    })

    it('should select trade', () => {
      const modals = [{ type: 'CoinifyExchangeData' }]
      saga.next(modals).select(selectors.core.data.coinify.getTrade)
    })

    it('should close the modal if modal is CoinifyExchangeData', () => {
      const trade = { data: { state: 'awaiting_transfer_in' } }
      saga.next(trade).put(actions.modals.closeAllModals())
    })

    it('should go to order history if trade state is awaiting_transfer_in', () => {
      const trade = { data: { state: 'awaiting_transfer_in' } }
      const modals = []
      saga
        .restart()
        .next()
        .select(selectors.modals.getModals)
        .next(modals)
        .select(selectors.core.data.coinify.getTrade)
        .next(trade)
        .put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
        .next()
        .put(coinifyActions.coinifyNextCheckoutStep('checkout'))
    })
  })

  describe('cancelTrade', () => {
    let { cancelTrade } = coinifySagas({
      coreSagas
    })
    const data = {
      payload: {
        id: 1
      }
    }

    let saga = testSaga(cancelTrade, data)

    it('should setCancelTradeId', () => {
      saga.next().put(coinifyActions.setCancelTradeId(data.payload.id))
    })

    it('should trigger loading', () => {
      saga.next().put(coinifyActions.coinifyLoading())
    })

    it('should call the core to cancel the trade', () => {
      const trade = data.payload
      saga.next().call(coreSagas.data.coinify.cancelTrade, { trade })
    })

    it('should trigger success', () => {
      saga.next().put(coinifyActions.coinifySuccess())
    })
  })

  describe('cancelSubscription', () => {
    let { cancelSubscription } = coinifySagas({
      coreSagas
    })
    const data = {
      payload: {
        id: 1
      }
    }

    let saga = testSaga(cancelSubscription, data)

    it('should trigger loading', () => {
      saga.next().put(coinifyActions.coinifyLoading())
    })

    it('should call the core to cancel the subscription', () => {
      const id = data.payload.id
      saga.next().call(coreSagas.data.coinify.cancelSubscription, { id })
    })

    it('should trigger success', () => {
      saga.next().put(coinifyActions.coinifySuccess())
    })
  })

  describe('deleteBankAccount', () => {
    let { deleteBankAccount } = coinifySagas({
      coreSagas
    })
    const payload = {
      id: 1
    }

    let saga = testSaga(deleteBankAccount, payload)

    it('should call the core to delete the account', () => {
      saga.next().call(coreSagas.data.coinify.deleteBankAccount, payload)
    })

    it('should select the quote', () => {
      saga.next().select(selectors.core.data.coinify.getQuote)
    })

    it('should call the core to get mediums and accounts', () => {
      const quote = { data: { amount: 100 } }
      saga.next(quote).put(actions.core.data.coinify.getMediumsWithBankAccounts(quote.data))
    })
  })

  describe('checkoutCardMax', () => {
    let { checkoutCardMax } = coinifySagas({
      coreSagas
    })
    const action = {
      payload: {
        card: { inRemaining: { EUR: 300, GBP: 250 } }
      }
    }

    let saga = testSaga(checkoutCardMax, action)

    it('should select the level', () => {
      saga.next().select(selectors.core.data.coinify.getLevel)
    })

    it('should change the form to use max', () => {
      const level = { currency: 'EUR' }
      saga.next(Remote.of(level)).put(actions.form.change('coinifyCheckoutBuy', 'leftVal', 300))
    })
  })

  describe('sell', () => {
    let { sell } = coinifySagas({
      coreSagas
    })

    let saga = testSaga(sell)

    const beforeEnd = 'beforeEnd'

    it('should prompt for second password', () => {
      saga.next().call(promptForSecondPassword)
    })

    it('should set loading', () => {
      const password = secondPassword
      saga.next(password).put(coinifyActions.coinifyLoading())
    })

    it('should call the core to sell', () => {
      saga.next().call(coreSagas.data.coinify.sell)
    })

    it('should select the payment', () => {
      const trade = mockSellTrade
      saga.next(trade).select(sendBtcSelectors.getPayment)
    })

    it('should create payment', () => {
      const p = Remote.of(null)
      saga.next(p)
      expect(coreSagas.payment.btc.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.btc.create).toHaveBeenCalledWith({ payment: p.getOrElse({}), network: settings.NETWORK })
    })

    it('should update the payment amount', () => {
      saga.next(paymentMock)

      expect(paymentMock.amount).toHaveBeenCalledTimes(1)
      expect(paymentMock.amount).toHaveBeenCalledWith(500)
    })

    it('should select the state to check for a qa address', () => {
      saga.next(paymentMock).select()
    })

    it('should set payment.to to the trade receiveAddress', () => {
      const state = {}
      saga.next(state)

      expect(paymentMock.to).toHaveBeenCalledTimes(1)
      expect(paymentMock.to).toHaveBeenCalledWith(tradeReceiveAddress)
    })

    it('should set a description', () => {
      saga.next(paymentMock)

      expect(paymentMock.description).toHaveBeenCalledTimes(1)
      expect(paymentMock.description).toHaveBeenCalledWith('Exchange Trade COINIFY=56789')
    })

    it('should call payment.build', () => {
      saga.next(paymentMock)

      expect(paymentMock.build).toHaveBeenCalledTimes(1)
    })

    it('should update payment success', () => {
      saga.next(paymentMock).put(sendBtcActions.sendBtcPaymentUpdatedSuccess(paymentMock.value()))
    })

    it('should call payment.sign with the second password', () => {
      saga.next(paymentMock)

      expect(paymentMock.sign).toHaveBeenCalledTimes(1)
      expect(paymentMock.sign).toHaveBeenCalledWith(secondPassword)
    })

    it('should call payment.publish', () => {
      saga.next(paymentMock)

      expect(paymentMock.publish).toHaveBeenCalledTimes(1)
    })

    it('should update payment success again', () => {
      saga.next(paymentMock).put(sendBtcActions.sendBtcPaymentUpdatedSuccess(paymentMock.value()))
    })

    it('should set success state', () => {
      saga.next().put(coinifyActions.coinifySuccess())
    })

    it('should change the form to order_history', () => {
      saga.next().put(actions.form.change('buySellTabStatus', 'status', 'order_history')).save(beforeEnd)
    })

    it('should show the trade details modal', () => {
      saga.next().put(actions.modals.showModal('CoinifyTradeDetails', { trade: mockSellTrade }))
    })

    describe('error handling', () => {
      const error = 'ERROR'
      it('should set failure and log the error', () => {
        saga
          .restore(beforeEnd)
          .throw(error)
          .put(coinifyActions.coinifyFailure(error))
          .next()
          .put(actions.logs.logErrorMessage(logLocation, 'sell', error))
      })
    })
  })
})
