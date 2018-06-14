import { put, call, select } from 'redux-saga/effects'
import { any, merge, path, prop, equals, head } from 'ramda'
import { delay } from 'redux-saga'
import * as A from './actions'
import * as actions from '../../actions'
import * as selectors from '../../selectors.js'
import * as C from 'services/AlertService'
import * as service from 'services/CoinifyService'
import * as sendBtcActions from '../../components/sendBtc/actions'
import * as sendBtcSelectors from '../../components/sendBtc/selectors'
import settings from 'config'
import { Remote } from 'blockchain-wallet-v4/src'
import { promptForSecondPassword } from 'services/SagaService'

export default ({ coreSagas }) => {
  const logLocation = 'modules/coinify/sagas'

  const coinifySignup = function * (data) {
    const country = data.payload
    try {
      yield call(coreSagas.data.coinify.signup, country)
      const profile = yield select(selectors.core.data.coinify.getProfile)
      if (!profile.error) {
        yield call(coreSagas.data.coinify.triggerKYC)
        yield put(A.coinifyNextStep('isx'))
      } else {
        yield put(A.coinifySignupFailure(profile.error))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'coinifySignup', e))
      yield put(actions.alerts.displayError(C.COINIFY_SIGNUP_ERROR))
    }
  }

  const coinifySaveMedium = function * (data) {
    const medium = data.payload
    yield put(A.saveMediumSuccess(medium))
  }

  const buy = function * (payload) {
    try {
      const buyTrade = yield call(coreSagas.data.coinify.buy, payload)

      if (!buyTrade) {
        const trade = yield select(selectors.core.data.coinify.getTrade)
        const parsed = JSON.parse(trade.error)

        yield put(A.coinifyFailure(parsed))
        return
      }

      if (buyTrade.medium === 'bank') {
        yield put(A.coinifyNextCheckoutStep('bankTransferDetails'))
      } else {
        yield put(A.coinifyNextCheckoutStep('isx'))
      }
      yield put(A.coinifyNotAsked())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'buy', e))
    }
  }

  const sell = function * () {
    try {
      yield put(A.coinifyLoading())
      const trade = yield call(coreSagas.data.coinify.sell)

      if (!trade) {
        const trade = yield select(selectors.core.data.coinify.getTrade)
        const parsed = JSON.parse(trade.error)

        yield put(A.coinifyFailure(parsed))
        return
      }
      const p = yield select(sendBtcSelectors.getPayment)
      let payment = yield coreSagas.payment.btc.create(
        { payment: p.getOrElse({}), network: settings.NETWORK })
      payment = yield payment.amount(parseInt(trade.sendAmount))

      // QA Tool: manually set a "to" address on the payment object for testing sell
      const qaState = yield select()
      const qaAddress = path(['qa', 'qaSellAddress'], qaState)

      if (qaAddress) {
        payment = yield payment.to(qaAddress)
      } else {
        payment = yield payment.to(path(['transferIn', 'details', 'account'], trade))
      }

      payment = yield payment.description(`Exchange Trade COINIFY=${trade.id}`)
      payment = yield payment.build()

      yield put(sendBtcActions.sendBtcPaymentUpdated(Remote.of(payment.value())))
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()
      yield put(sendBtcActions.sendBtcPaymentUpdated(Remote.of(payment.value())))
      yield put(A.coinifySuccess())
      yield put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
      yield put(actions.modals.showModal('CoinifyTradeDetails', { trade }))
    } catch (e) {
      yield put(A.coinifyFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'sell', e))
    }
  }

  const initialized = function * (action) {
    try {
      const { type } = action.payload
      const level = yield select(selectors.core.data.coinify.getLevel)
      const currencyR = level.map(l => l.currency)

      const initialValues = {
        leftVal: '',
        rightVal: '',
        currency: currencyR.getOrElse('EUR')
      }

      if (type === 'buy') {
        yield put(actions.form.initialize('coinifyCheckoutBuy', initialValues))
      } else {
        yield put(actions.form.initialize('coinifyCheckoutSell', initialValues))
      }
      yield put(actions.core.data.coinify.fetchRateQuote(currencyR.getOrElse('EUR'), type))
      yield put(A.setCoinifyCheckoutError(false))
      yield put(A.coinifyCheckoutBusyOn())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const checkoutCardMax = function * (action) {
    try {
      const { card } = action.payload
      const levelR = yield select(selectors.core.data.coinify.getLevel)
      const currency = levelR.map(l => l.currency).getOrElse('EUR')
      const cardMax = path([currency], card.inRemaining)
      yield put(actions.form.change('coinifyCheckoutBuy', 'leftVal', cardMax))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'checkoutCardMax', e))
    }
  }

  const handleChange = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!any(equals(form))(['coinifyCheckoutBuy', 'coinifyCheckoutSell'])) return
      yield put(A.coinifyCheckoutBusyOn())
      if (!payload) return null

      const limits = yield select(selectors.core.data.coinify.getLimits)
      const values = yield select(selectors.form.getFormValues(form))
      const type = form === 'coinifyCheckoutBuy' ? 'buy' : 'sell'

      switch (field) {
        case 'leftVal':
          if (type === 'buy') {
            const leftLimitsError = service.getLimitsError(payload, limits.data, values.currency, type)
            if (leftLimitsError) {
              yield put(A.setCoinifyCheckoutError(leftLimitsError))
              return
            } else {
              yield put(A.clearCoinifyCheckoutError())
            }
          }

          const leftResult = yield call(coreSagas.data.coinify.fetchQuote,
            { quote: { amount: payload * 100, baseCurrency: values.currency, quoteCurrency: 'BTC', type } })
          const amount = Math.abs(leftResult.quoteAmount)

          if (type === 'sell') {
            let btcAmt = (amount / 1e8)
            const leftLimitsError = service.getLimitsError(btcAmt, limits.data, values.currency, type)
            if (leftLimitsError) {
              yield put(A.setCoinifyCheckoutError(leftLimitsError))
            } else {
              const payment = yield select(sendBtcSelectors.getPayment)
              const effectiveBalance = prop('effectiveBalance', payment.getOrElse(undefined))
              if (service.isOverEffectiveMax(amount, effectiveBalance)) yield put(A.setCoinifyCheckoutError('over_effective_max'))
              else yield put(A.clearCoinifyCheckoutError())
            }
          }

          yield put(actions.form.initialize(form, merge(values, { 'rightVal': amount / 1e8 })))
          yield put(A.coinifyCheckoutBusyOff())
          break
        case 'rightVal':
          if (type === 'sell') {
            const rightLimitsError = service.getLimitsError(payload, limits.data, values.currency, type)
            if (rightLimitsError) {
              yield put(A.setCoinifyCheckoutError(rightLimitsError))
              return
            } else {
              yield put(A.clearCoinifyCheckoutError())
            }
          }

          const rightResult = yield call(coreSagas.data.coinify.fetchQuote,
            { quote: { amount: Math.round((payload * 1e8) * -1), baseCurrency: 'BTC', quoteCurrency: values.currency, type } })
          const fiatAmount = Math.abs(rightResult.quoteAmount)

          let rightLimitsError
          if (type === 'sell') rightLimitsError = service.getLimitsError(payload, limits.data, values.currency, type)
          if (type === 'buy') rightLimitsError = service.getLimitsError(fiatAmount, limits.data, values.currency, type)

          if (rightLimitsError) {
            yield put(A.setCoinifyCheckoutError(rightLimitsError))
            yield put(actions.form.initialize(form, merge(values, { 'leftVal': fiatAmount })))
          } else {
            const payment = yield select(sendBtcSelectors.getPayment)
            const effectiveBalance = prop('effectiveBalance', payment.getOrElse(undefined))
            if (service.isOverEffectiveMax(payload * 1e8, effectiveBalance)) yield put(A.setCoinifyCheckoutError('over_effective_max'))
            else yield put(A.clearCoinifyCheckoutError())
          }

          yield put(actions.form.initialize(form, merge(values, { 'leftVal': fiatAmount })))
          yield put(A.coinifyCheckoutBusyOff())
          break
        case 'currency':
          yield put(actions.core.data.coinify.fetchRateQuote(payload))
          yield put(actions.form.initialize(form, merge(values, { 'leftVal': '', 'rightVal': '' })))
          yield put(A.coinifyCheckoutBusyOn())
          break
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'handleChange', e))
    }
  }

  const fromISX = function * (action) {
    const status = action.payload
    try {
      const modals = yield select(selectors.modals.getModals)
      const trade = yield select(selectors.core.data.coinify.getTrade)

      if (path(['type'], head(modals)) === 'CoinifyExchangeData') {
        yield put(A.coinifySignupComplete())
        yield call(delay, 500)
        yield put(actions.modals.closeAllModals())
      } else if (trade.data.constructor.name !== 'Trade') {
        yield put(actions.form.change('buySellTabStatus', 'status', 'buy'))
      } else {
        yield put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
      }
      yield put(A.coinifyNextCheckoutStep('checkout'))
      yield put(actions.modals.showModal('CoinifyTradeDetails', { trade: trade.data, status: status }))
      yield call(coreSagas.data.coinify.getKYCs)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'fromISX', e))
    }
  }

  const triggerKYC = function * () {
    try {
      yield call(coreSagas.data.coinify.triggerKYC)
      yield put(A.coinifyNextCheckoutStep('isx'))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'triggerKYC', e))
    }
  }

  const openKYC = function * (data) {
    let kyc = data.payload
    const inProgressKycs = yield select(selectors.core.data.coinify.getSortedKycs)
    const recentKyc = head(inProgressKycs.data)

    try {
      if (!data.payload && !equals(prop('state', recentKyc), 'pending')) {
        yield call(triggerKYC)
      } else if (equals(prop('state', kyc), 'pending') || equals(prop('state', recentKyc), 'pending')) {
        yield call(coreSagas.data.coinify.kycAsTrade, { kyc: kyc || recentKyc }) // if no kyc was given, take the most recent
        yield put(A.coinifyNextCheckoutStep('isx'))
      } else {
        yield call(triggerKYC)
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'openKYC', e))
    }
  }

  const deleteBankAccount = function * (payload) {
    try {
      yield call(coreSagas.data.coinify.deleteBankAccount, payload)
      const quote = yield select(selectors.core.data.coinify.getQuote)
      yield put(actions.core.data.coinify.getMediumsWithBankAccounts(quote.data))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'deleteBankAccount', e))
    }
  }

  const finishTrade = function * (data) {
    const tradeToFinish = data.payload
    try {
      if (tradeToFinish.state === 'awaiting_transfer_in') {
        if (tradeToFinish.medium === 'card') {
          yield call(coreSagas.data.coinify.kycAsTrade, { kyc: tradeToFinish }) // core expects obj key to be 'kyc'
          yield put(A.coinifyNextCheckoutStep('isx'))
        } else if (tradeToFinish.medium === 'bank') {
          yield put(actions.modals.showModal('CoinifyTradeDetails', { trade: tradeToFinish }))
        }
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'finishTrade', e))
    }
  }

  const cancelISX = function * () {
    const modals = yield select(selectors.modals.getModals)
    const trade = yield select(selectors.core.data.coinify.getTrade)

    if (path(['type'], head(modals)) === 'CoinifyExchangeData') {
      yield put(actions.modals.closeAllModals())
    } else if (trade.data.state === 'awaiting_transfer_in') {
      yield put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
      yield put(A.coinifyNextCheckoutStep('checkout'))
    } else {
      yield put(A.coinifyNextCheckoutStep('checkout'))
    }
  }

  const cancelTrade = function * (data) {
    const trade = data.payload
    try {
      yield put(A.setCancelTradeId(trade.id))
      yield put(A.coinifyLoading())
      yield call(coreSagas.data.coinify.cancelTrade, { trade })
      yield put(A.coinifySuccess())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'cancelTrade', e))
    }
  }

  const cancelSubscription = function * (data) {
    const id = path(['payload', 'id'], data)
    try {
      yield put(A.coinifyLoading())
      yield call(coreSagas.data.coinify.cancelSubscription, { id })
      yield put(A.coinifySuccess())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'cancelSubscription', e))
    }
  }

  return {
    buy,
    cancelISX,
    cancelSubscription,
    cancelTrade,
    checkoutCardMax,
    coinifySaveMedium,
    coinifySignup,
    deleteBankAccount,
    finishTrade,
    fromISX,
    handleChange,
    initialized,
    openKYC,
    sell,
    triggerKYC
  }
}
