import { select } from 'redux-saga/effects'
import { promptForSecondPassword } from 'services/SagaService'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as actions from '../../actions'
import * as coinifyActions from './actions.js'
import * as selectors from '../../selectors.js'
import coinifySagas, { logLocation, sellDescription } from './sagas'
import * as C from 'services/AlertService'
import { merge } from 'ramda'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory()
const networks = { btc: 'bitcoin' }

describe('coinifySagas', () => {
  beforeAll(() => {
    Math.random = () => 0.5
  })

  const mockedLimits = Remote.of({
    bank: {
      inRemaining: { EUR: 150, USD: 150, GBP: 150, DKK: 150 },
      minimumInAmounts: { EUR: 0, USD: 0, GBP: 0, DKK: 0 }
    },
    card: {
      inRemaining: { EUR: 150, USD: 150, GBP: 150, DKK: 150 },
      minimumInAmounts: { EUR: 0, USD: 0, GBP: 0, DKK: 0 }
    },
    blockchain: {
      inRemaining: { BTC: 0.5 },
      minimumInAmounts: { BTC: 0.0001 }
    }
  })
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
      coreSagas,
      networks
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
      saga
        .next()
        .select(selectors.core.data.coinify.getProfile())
        .save(beforeDetermine)
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
        .put(
          coinifyActions.coinifySignupFailure(JSON.parse(errorProfile.error))
        )
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log and display an error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'coinifySignup', error)
          )
          .next()
          .put(actions.alerts.displayError(C.COINIFY_SIGNUP_ERROR))
      })
    })
  })

  describe('triggerKYC', () => {
    let { triggerKYC } = coinifySagas({
      coreSagas,
      networks
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
      coreSagas,
      networks
    })

    const action = {
      payload: {
        status: 'complete'
      }
    }

    it('should call signupComplete if modal type is CoinifyExchangeData', () => {
      const modals = [{ type: 'CoinifyExchangeData' }]
      const trade = Remote.of({})
      return expectSaga(fromISX, action)
        .provide([
          [select(selectors.modals.getModals), modals],
          [select(selectors.core.data.coinify.getTrade), trade]
        ])
        .put(coinifyActions.coinifySignupComplete())
        .run()
    })

    it('should change the form if constructor is not Trade', () => {
      const modals = [{ type: 'other' }]
      const trade = Remote.of({ constructor: { name: 'ISX' } })
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
      const trade = Remote.of({ constructor: { name: 'Trade' } })
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
      coreSagas,
      networks
    })

    const data = {
      payload: {
        kyc: {
          id: 1,
          state: 'pending'
        }
      }
    }

    let saga = testSaga(openKYC, data)

    const saveToRestore = 'saveToRestore'

    it('should select kyc', () => {
      saga.next().select(selectors.core.data.coinify.getKyc)
    })

    it('should call the core kycAsTrade', () => {
      const recentKyc = Remote.of({ state: 'pending' })
      saga
        .next(recentKyc)
        .call(coreSagas.data.coinify.kycAsTrade, { kyc: data.payload })
        .save(saveToRestore)
    })

    it('should go to isx step', () => {
      saga.next().put(coinifyActions.coinifyNextCheckoutStep('isx'))
    })

    describe('error handling', () => {
      const error = 'ERROR'
      it('should log the error', () => {
        saga
          .restore(saveToRestore)
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'openKYC', error))
      })
    })
  })

  describe('openKYC - empty payload', () => {
    let { openKYC, triggerKYC } = coinifySagas({
      coreSagas,
      networks
    })

    const data = {
      payload: null
    }

    let saga = testSaga(openKYC, data)

    it('should select kyc', () => {
      saga.next().select(selectors.core.data.coinify.getKyc)
    })

    it('should trigger KYC', () => {
      saga.next(Remote.of({ state: 'completed' })).call(triggerKYC)
    })
  })

  describe('finishTrade', () => {
    let { finishTrade } = coinifySagas({
      coreSagas,
      networks
    })

    const data = {
      payload: { state: 'awaiting_transfer_in', medium: 'card' }
    }

    let saga = testSaga(finishTrade, data)
    let saveToRestore = 'saveToRestore'

    it('should call handleTradeSuccess if trade state is awaiting_trasnfer_in', () => {
      saga
        .next(data.payload)
        .put(actions.core.data.coinify.handleTradeSuccess(data.payload))
    })

    it('should call core kycAsTrade', () => {
      saga
        .next(data.payload)
        .call(coreSagas.data.coinify.kycAsTrade, { kyc: data.payload })
        .save(saveToRestore)
    })

    it('should go to next step isx', () => {
      saga.next().put(coinifyActions.coinifyNextCheckoutStep('isx'))
    })

    describe('error handling', () => {
      const error = 'ERROR'
      it('should log the error', () => {
        saga
          .restore(saveToRestore)
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'finishTrade', error))
      })
    })
  })

  describe('finishTrade with bank', () => {
    let { finishTrade } = coinifySagas({
      coreSagas,
      networks
    })
    const data = {
      payload: { state: 'awaiting_transfer_in', medium: 'bank' }
    }

    let saga = testSaga(finishTrade, data)

    it('should call handleTradeSuccess if trade state is awaiting_trasnfer_in', () => {
      const tradeToFinish = data.payload
      saga
        .next(tradeToFinish)
        .put(actions.core.data.coinify.handleTradeSuccess(tradeToFinish))
    })

    it('should open the trade details modal if bank', () => {
      const tradeToFinish = data.payload
      saga.next(tradeToFinish).put(
        actions.modals.showModal('CoinifyTradeDetails', {
          trade: tradeToFinish
        })
      )
    })
  })

  describe('coinify buy', () => {
    const { buy, prepareAddress } = coinifySagas({
      coreSagas,
      networks
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
      saga
        .next(nextAddressData)
        .call(coreSagas.data.coinify.buy, payload, nextAddressData)
        .save(beforeResponse)
    })

    it('should go to bank details if medium is bank', () => {
      const buyTrade = { medium: 'bank' }
      saga
        .next(buyTrade)
        .put(coinifyActions.coinifyNextCheckoutStep('bankTransferDetails'))
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

    describe('error handling', () => {
      const error = 'ERROR'
      it('should log the error', () => {
        saga
          .restore(beforeResponse)
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'buy', error))
      })
    })
  })

  describe('coinify prepareAddress', () => {
    const { prepareAddress } = coinifySagas({
      coreSagas,
      networks
    })

    const saga = testSaga(prepareAddress)

    it('should select the state', () => {
      saga.next().select()
    })

    describe('error handling', () => {
      const error = 'ERROR'
      it('should log the error', () => {
        saga
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'prepareAddress', error)
          )
      })
    })
  })

  describe('initialized buy', () => {
    let { initialized } = coinifySagas({
      coreSagas,
      networks
    })
    const action = {
      payload: {
        type: 'buy'
      }
    }

    let saga = testSaga(initialized, action)

    let saveToRestore = 'saveToRestore'

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
      saga
        .next(Remote.of(level))
        .put(actions.form.initialize('coinifyCheckoutBuy', initialValues))
    })

    it('should fetch a rate quote', () => {
      const currency = 'EUR'
      const type = 'buy'
      saga
        .next()
        .put(actions.core.data.coinify.fetchRateQuote(currency, type))
        .save(saveToRestore)
    })

    it('should set coinifyCheckoutError', () => {
      saga.next().put(coinifyActions.setCoinifyCheckoutError(false))
    })

    it('should set busy on', () => {
      saga.next().put(coinifyActions.coinifyCheckoutBusyOn())
    })
    describe('error handling', () => {
      const error = 'ERROR'
      it('should log the error', () => {
        saga
          .restore(saveToRestore)
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'initialized', error))
      })
    })
  })

  describe('initialized sell', () => {
    let { initialized } = coinifySagas({
      coreSagas,
      networks
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
      saga
        .next(Remote.of(level))
        .put(actions.form.initialize('coinifyCheckoutSell', initialValues))
    })

    it('should select limits', () => {
      saga.next().select(selectors.core.data.coinify.getLimits)
    })

    it('should get the default account index', () => {
      saga
        .next(Remote.of({}))
        .select(selectors.core.wallet.getDefaultAccountIndex)
    })
  })

  describe('handle currency change', () => {
    let { handleChange } = coinifySagas({
      coreSagas,
      networks
    })
    const action = {
      payload: 'GBP',
      meta: {
        form: 'coinifyCheckoutBuy',
        field: 'currency'
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

    it('should select the state', () => {
      const values = { currency: 'GBP' }
      saga.next(values).select()
    })

    it('should dispatch an action to fetch a rate quote with the new currency', () => {
      const values = { currency: 'GBP' }
      saga.next(values).put(actions.core.data.coinify.fetchRateQuote('GBP'))
    })

    it('should initialize the form with no values', () => {
      saga
        .next()
        .put(
          actions.form.initialize(
            'coinifyCheckoutBuy',
            merge({ currency: 'GBP' }, { leftVal: '', rightVal: '' })
          )
        )
    })

    it('should set busy on', () => {
      saga
        .next()
        .put(coinifyActions.coinifyCheckoutBusyOn())
        .next()
        .isDone()
    })
  })

  describe('handle fiat (leftVal) change - Buy', () => {
    let { handleChange } = coinifySagas({
      coreSagas,
      networks
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

    it('should select the state', () => {
      const values = { currency: 'EUR' }
      saga.next(values).select()
    })

    it('should clear coinifyCheckoutError', () => {
      const values = { currency: 'EUR' }
      saga.next(values).put(coinifyActions.clearCoinifyCheckoutError())
    })

    it('should fetch a quote', () => {
      saga.next().call(coreSagas.data.coinify.fetchQuote, {
        quote: {
          amount: action.payload * 100,
          baseCurrency: 'EUR',
          quoteCurrency: 'BTC',
          type: 'buy'
        }
      })
    })

    it('should initialize the form with the new values', () => {
      const leftResult = { quoteAmount: 200000 }
      saga
        .next(leftResult)
        .put(
          actions.form.initialize(
            'coinifyCheckoutBuy',
            merge(
              { currency: 'EUR' },
              { rightVal: leftResult.quoteAmount / 1e8 }
            )
          )
        )
    })

    it('should trigger busy off', () => {
      saga
        .next()
        .put(coinifyActions.coinifyCheckoutBusyOff())
        .next()
        .isDone()
    })
  })

  describe('handle crypto (rightVal) change - Buy', () => {
    let { handleChange } = coinifySagas({
      coreSagas,
      networks
    })
    const action = {
      payload: 100,
      meta: {
        form: 'coinifyCheckoutBuy',
        field: 'rightVal'
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

    it('should select the state', () => {
      const values = { currency: 'EUR' }
      saga.next(values).select()
    })

    it('should fetch a quote', () => {
      const values = { currency: 'EUR' }
      saga.next(values).call(coreSagas.data.coinify.fetchQuote, {
        quote: {
          amount: Math.round(action.payload * 1e8 * -1),
          baseCurrency: 'BTC',
          quoteCurrency: 'EUR',
          type: 'buy'
        }
      })
    })

    it('should clear any checkout error', () => {
      const rightResult = { quoteAmount: 100 }
      saga.next(rightResult).put(coinifyActions.clearCoinifyCheckoutError())
    })

    it('should initialize the form with the new values', () => {
      const leftResult = { quoteAmount: 200000 }
      saga
        .next(leftResult)
        .put(
          actions.form.initialize(
            'coinifyCheckoutBuy',
            merge({ currency: 'EUR' }, { leftVal: 100 })
          )
        )
    })

    it('should trigger busy off', () => {
      saga
        .next()
        .put(coinifyActions.coinifyCheckoutBusyOff())
        .next()
        .isDone()
    })
  })

  describe('handle fiat (leftVal) change - Sell', () => {
    let { handleChange } = coinifySagas({
      coreSagas,
      networks
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

    it('should select the state', () => {
      const values = { currency: 'EUR' }
      saga.next(values).select()
    })

    it('should fetch a quote', () => {
      const state = {
        coinify: {
          payment: Remote.of({ effectiveBalance: 250000000 })
        }
      }
      saga.next(state).call(coreSagas.data.coinify.fetchQuote, {
        quote: {
          amount: action.payload * 100,
          baseCurrency: 'EUR',
          quoteCurrency: 'BTC',
          type: 'sell'
        }
      })
    })

    it('should clear any checkout error', () => {
      const leftResult = { quoteAmount: 200000 }
      saga.next(leftResult).put(coinifyActions.clearCoinifyCheckoutError())
    })

    it('should initialize the form with the new values', () => {
      const leftResult = { quoteAmount: 200000 }
      saga
        .next(leftResult)
        .put(
          actions.form.initialize(
            'coinifyCheckoutSell',
            merge(
              { currency: 'EUR' },
              { rightVal: leftResult.quoteAmount / 1e8 }
            )
          )
        )
    })

    it('should trigger busy off', () => {
      saga.next().put(coinifyActions.coinifyCheckoutBusyOff())
    })
  })

  describe('handle crypto (rightVal) change - Sell', () => {
    let { handleChange } = coinifySagas({
      coreSagas,
      networks
    })
    const action = {
      payload: 0.000005,
      meta: {
        form: 'coinifyCheckoutSell',
        field: 'rightVal'
      }
    }

    let saga = testSaga(handleChange, action)

    const saveToRestore = 'saveToRestore'

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

    it('should select the state', () => {
      const values = { currency: 'EUR' }
      saga
        .next(values)
        .select()
        .save(saveToRestore)
    })

    it('should clear checkout error', () => {
      const state = {
        coinify: {
          payment: Remote.of({ effectiveBalance: 250000000 })
        }
      }
      saga.next(state).put(coinifyActions.setCoinifyCheckoutError('under_min'))
    })

    it('should set limits error', () => {
      const state = {
        coinify: {
          payment: Remote.of({ effectiveBalance: 0.0123 })
        }
      }
      saga
        .restore(saveToRestore)
        .next(state)
        .put(coinifyActions.setCoinifyCheckoutError('effective_max_under_min'))
    })

    describe('error handling', () => {
      const error = 'ERROR'
      it('should log the error', () => {
        saga
          .restore(saveToRestore)
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'handleChange', error))
      })
    })
  })

  describe('cancelISX', () => {
    let { cancelISX } = coinifySagas({
      coreSagas,
      networks
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
      const trade = Remote.of({ state: 'awaiting_transfer_in' })
      saga.next(trade).put(actions.modals.closeAllModals())
    })

    it('should go to order history if trade state is awaiting_transfer_in', () => {
      const trade = Remote.of({ state: 'awaiting_transfer_in' })
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

    it('should go to checkout if trade state is not awaiting_transfer_in', () => {
      const trade = Remote.of({ state: 'processing' })
      const modals = []
      saga
        .restart()
        .next()
        .select(selectors.modals.getModals)
        .next(modals)
        .select(selectors.core.data.coinify.getTrade)
        .next(trade)
        .put(coinifyActions.coinifyNextCheckoutStep('checkout'))
    })
  })

  describe('cancelTrade', () => {
    let { cancelTrade } = coinifySagas({
      coreSagas,
      networks
    })
    const data = {
      payload: {
        id: 1
      }
    }

    let saga = testSaga(cancelTrade, data)
    let saveToRestore = 'saveToRestore'

    it('should setCancelTradeId', () => {
      saga.next().put(coinifyActions.setCancelTradeId(data.payload.id))
    })

    it('should trigger loading', () => {
      saga
        .next()
        .put(coinifyActions.coinifyLoading())
        .save(saveToRestore)
    })

    it('should call the core to cancel the trade', () => {
      const trade = data.payload
      saga.next().call(coreSagas.data.coinify.cancelTrade, { trade })
    })

    it('should trigger success', () => {
      saga.next().put(coinifyActions.coinifySuccess())
    })

    describe('error handling', () => {
      const error = 'ERROR'
      it('should log the error', () => {
        saga
          .restore(saveToRestore)
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'cancelTrade', error))
      })
    })
  })

  describe('cancelSubscription', () => {
    let { cancelSubscription } = coinifySagas({
      coreSagas,
      networks
    })
    const data = {
      payload: {
        id: 1
      }
    }

    let saga = testSaga(cancelSubscription, data)
    let saveToRestore = 'saveToRestore'

    it('should trigger loading', () => {
      saga
        .next()
        .put(coinifyActions.coinifyLoading())
        .save(saveToRestore)
    })

    it('should call the core to cancel the subscription', () => {
      const id = data.payload.id
      saga.next().call(coreSagas.data.coinify.cancelSubscription, { id })
    })

    it('should trigger success', () => {
      saga.next().put(coinifyActions.coinifySuccess())
    })

    describe('error handling', () => {
      const error = 'ERROR'
      it('should log the error', () => {
        saga
          .restore(saveToRestore)
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'cancelSubscription',
              error
            )
          )
      })
    })
  })

  describe('deleteBankAccount', () => {
    let { deleteBankAccount } = coinifySagas({
      coreSagas,
      networks
    })
    const payload = {
      id: 1
    }

    let saga = testSaga(deleteBankAccount, payload)
    let saveToRestore = 'saveToRestore'

    it('should call the core to delete the account', () => {
      saga.next().call(coreSagas.data.coinify.deleteBankAccount, payload)
    })

    it('should select the quote', () => {
      saga
        .next()
        .select(selectors.core.data.coinify.getQuote)
        .save(saveToRestore)
    })

    it('should call the core to get mediums and accounts', () => {
      const quote = Remote.of({ amount: 100 })
      saga
        .next(quote)
        .put(actions.core.data.coinify.getMediumsWithBankAccounts(quote.data))
    })

    describe('error handling', () => {
      const error = 'ERROR'
      it('should log the error', () => {
        saga
          .restore(saveToRestore)
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'deleteBankAccount',
              error
            )
          )
      })
    })
  })

  describe('checkoutCardMax', () => {
    let { checkoutCardMax } = coinifySagas({
      coreSagas,
      networks
    })
    const action = {
      payload: {
        card: { inRemaining: { EUR: 300, GBP: 250 } }
      }
    }

    let saga = testSaga(checkoutCardMax, action)
    let saveToRestore = 'saveToRestore'

    it('should select the level', () => {
      saga
        .next()
        .select(selectors.core.data.coinify.getLevel)
        .save(saveToRestore)
    })

    it('should change the form to use max', () => {
      const level = { currency: 'EUR' }
      saga
        .next(Remote.of(level))
        .put(actions.form.change('coinifyCheckoutBuy', 'leftVal', 300))
    })

    describe('error handling', () => {
      const error = 'ERROR'
      it('should log the error', () => {
        saga
          .restore(saveToRestore)
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'checkoutCardMax', error)
          )
      })
    })
  })

  describe('sell', () => {
    let { sell } = coinifySagas({
      coreSagas,
      networks
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

    it('should select the state', () => {
      const trade = mockSellTrade
      saga.next(trade).select()
    })

    it('should create payment', () => {
      const state = {
        coinify: {
          payment: Remote.of(null)
        }
      }
      saga.next(state)
      expect(coreSagas.payment.btc.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.btc.create).toHaveBeenCalledWith({
        payment: state.coinify.payment.getOrElse({}),
        network: networks.btc
      })
    })

    it('should update the payment amount', () => {
      saga.next(paymentMock)

      expect(paymentMock.amount).toHaveBeenCalledTimes(1)
      expect(paymentMock.amount).toHaveBeenCalledWith(500)
    })

    it('should set payment.to to the trade receiveAddress', () => {
      saga.next(paymentMock)

      expect(paymentMock.to).toHaveBeenCalledTimes(1)
      expect(paymentMock.to).toHaveBeenCalledWith(tradeReceiveAddress)
    })

    it('should set a description', () => {
      saga.next(paymentMock)

      expect(paymentMock.description).toHaveBeenCalledTimes(1)
      expect(paymentMock.description).toHaveBeenCalledWith(
        `${sellDescription}56789`
      )
    })

    it('should call payment.build', () => {
      saga.next(paymentMock)

      expect(paymentMock.build).toHaveBeenCalledTimes(1)
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

    it('should fetch btc data', () => {
      saga.next(paymentMock).put(actions.core.data.bitcoin.fetchData())
    })

    it('should set a tx note', () => {
      saga
        .next(paymentMock)
        .put(
          actions.core.wallet.setTransactionNote(
            paymentMock.value().txId,
            paymentMock.value().description
          )
        )
    })

    it('should set success state', () => {
      saga.next().put(coinifyActions.coinifySuccess())
    })

    it('should change the form to order_history', () => {
      saga
        .next()
        .put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
        .save(beforeEnd)
    })

    it('should show the trade details modal', () => {
      saga.next().put(
        actions.modals.showModal('CoinifyTradeDetails', {
          trade: mockSellTrade
        })
      )
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
