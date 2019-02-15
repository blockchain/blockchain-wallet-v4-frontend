import { promptForSecondPassword } from 'services/SagaService'
import { testSaga } from 'redux-saga-test-plan'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as actions from '../../actions'
import * as coinifyActions from './actions.js'
import * as selectors from '../../selectors.js'
import coinifySagas, { logLocation, sellDescription } from './sagas'
import * as C from 'services/AlertService'
import { merge } from 'ramda'
import * as model from '../../model'
const { STEPS } = model.components.identityVerification
jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory()
const networks = { btc: 'bitcoin' }

const api = { sendCoinifyKyc: jest.fn() }

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

  describe('coinify signup - new KYC user', () => {
    let { coinifySignup } = coinifySagas({
      coreSagas,
      networks
    })

    const COUNTRY = 'GB'
    const PROFILE = Remote.of({ id: '5' })

    let saga = testSaga(coinifySignup)
    const beforeDetermine = 'beforeDetermine'

    it('should select the country from state', () => {
      saga.next().put(coinifyActions.coinifyLoading())
      saga.next().select(selectors.components.coinify.getCoinifyCountry)
    })

    it('should call core signup with the payload', () => {
      saga.next(COUNTRY).call(coreSagas.data.coinify.signup, COUNTRY)
    })

    it('should select the profile', () => {
      saga
        .next()
        .select(selectors.core.data.coinify.getProfile)
        .save(beforeDetermine)
    })

    it('should get tier 2 data', () => {
      saga.next(PROFILE)
    })

    it('should set verification step to personal if state is NONE', () => {
      const tier2Data = Remote.of({ state: 'none' })
      saga
        .next(tier2Data)
        .put(
          actions.components.identityVerification.setVerificationStep(
            STEPS.personal
          )
        )
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

  describe('coinify signup - existing KYC user', () => {
    let { coinifySignup, handleAfterSignup } = coinifySagas({
      coreSagas,
      networks
    })

    const COUNTRY = 'GB'
    const PROFILE = Remote.of({ user: '5' })

    let saga = testSaga(coinifySignup)
    const beforeDetermine = 'beforeDetermine'

    it('should select the country from state', () => {
      saga.next().select(selectors.components.coinify.getCoinifyCountry)
    })

    it('should call core signup with the payload', () => {
      saga.next(COUNTRY).call(coreSagas.data.coinify.signup, COUNTRY)
    })

    it('should select the profile', () => {
      saga
        .next()
        .select(selectors.core.data.coinify.getProfile)
        .save(beforeDetermine)
    })

    it('should get tier 2 data', () => {
      saga.next(PROFILE)
    })

    it('should call handleAfterSignup with the userId', () => {
      const tier2Data = Remote.of({ state: 'verified' })
      saga.next(tier2Data).call(handleAfterSignup, '5')
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
    const { buy, prepareAddress, checkIfFirstTrade } = coinifySagas({
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

    it('should check if first trade', () => {
      saga.next().call(checkIfFirstTrade)
    })

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

    it('should fetch a quote', () => {
      const values = { currency: 'EUR' }
      saga.next(values).call(coreSagas.data.coinify.fetchQuote, {
        quote: {
          amount: action.payload * 100,
          baseCurrency: 'EUR',
          quoteCurrency: 'BTC',
          type: 'sell'
        }
      })
    })

    it('should select the payment', () => {
      const leftResult = { quoteAmount: 200000 }
      saga
        .next(leftResult)
        .select(selectors.components.coinify.getCoinifyPayment)
    })

    it('should clear any checkout error', () => {
      const payment = Remote.of({ effectiveBalance: 250000000 })
      saga.next(payment).put(coinifyActions.clearCoinifyCheckoutError())
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

    it('should select the payment', () => {
      const values = { currency: 'EUR' }
      saga
        .next(values)
        .select(selectors.components.coinify.getCoinifyPayment)
        .save(saveToRestore)
    })

    it('should clear checkout error', () => {
      const payment = Remote.of({ effectiveBalance: 250000000 })

      saga
        .next(payment)
        .put(coinifyActions.setCoinifyCheckoutError('under_min'))
    })

    it('should set limits error', () => {
      const payment = Remote.of({ effectiveBalance: 0.0123 })

      saga
        .restore(saveToRestore)
        .next(payment)
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

  describe('sell', () => {
    let { sell, checkIfFirstTrade } = coinifySagas({
      coreSagas,
      networks
    })

    let saga = testSaga(sell)

    const beforeEnd = 'beforeEnd'

    it('should check if first trade', () => {
      saga.next().call(checkIfFirstTrade)
    })

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

    it('should select the payment', () => {
      const state = {
        coinify: {
          payment: Remote.of(null)
        }
      }
      saga.next(state).select(selectors.components.coinify.getCoinifyPayment)
    })

    it('should create payment', () => {
      const p = Remote.of(null)
      saga.next(p)
      expect(coreSagas.payment.btc.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.btc.create).toHaveBeenCalledWith({
        payment: p.getOrElse({}),
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

  describe('sendCoinifyKYC', () => {
    let { sendCoinifyKYC } = coinifySagas({
      api,
      coreSagas,
      networks
    })

    const USER = Remote.of({ user: '1' })

    let saga = testSaga(sendCoinifyKYC)

    it('should selet the coinify user from metadata', () => {
      saga.next().select(selectors.core.kvStore.buySell.getCoinifyUser)
    })

    it('should call the backend if the user is present', () => {
      saga.next(USER).call(api.sendCoinifyKyc, USER.getOrElse())
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log an error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'sendCoinifyKyc', error)
          )
      })
    })
  })

  describe('fetchCoinifyData', () => {
    let { fetchCoinifyData } = coinifySagas({
      api,
      coreSagas,
      networks
    })

    let saga = testSaga(fetchCoinifyData)

    it('should fetch trades', () => {
      saga.next().put(actions.core.data.coinify.fetchTrades())
    })

    it('should getKyc', () => {
      saga.next().put(actions.core.data.coinify.getKyc())
    })

    it('should fetch subscriptions', () => {
      saga.next().put(actions.core.data.coinify.fetchSubscriptions())
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log an error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'fetchCoinifyData', error)
          )
      })
    })
  })

  describe('compareKyc', () => {
    let { compareKyc } = coinifySagas({
      api,
      coreSagas,
      networks
    })

    const USER = Remote.of('12345')
    const LEVEL = Remote.of({ name: '1' })
    const TIER_TWO = Remote.of({ state: 'verified' })

    let saga = testSaga(compareKyc)

    it('should select tier 2 data', () => {
      saga.next()
    })

    it('should select the coinify profile level', () => {
      saga.next(TIER_TWO).select(selectors.core.data.coinify.getLevel)
    })

    it('should select the user id if coinify is level 1 and user is KYC Verified', () => {
      saga.next(LEVEL).select(selectors.core.data.coinify.getUserId)
    })

    it('should call the backend to sync with coinify KYC', () => {
      saga.next(USER).call(api.sendCoinifyKyc, USER.getOrElse())
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log an error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'compareKyc', error))
      })
    })
  })
})
