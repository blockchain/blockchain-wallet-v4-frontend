import { put, call, select } from 'redux-saga/effects'
import * as A from './actions'
import * as actions from '../../actions'
import * as selectors from '../../selectors.js'
// import { formValueSelector } from 'redux-form'
import { merge, path, prop, equals } from 'ramda'
import * as service from 'services/CoinifyService'

export default ({ coreSagas }) => {
  const coinifySignup = function * () {
    try {
      yield call(coreSagas.data.coinify.signup)
      const profile = yield select(selectors.core.data.coinify.getProfile)
      if (!profile.error) {
        yield put(actions.modals.closeAllModals())
        // yield put(A.coinifyNextStep('isx'))
        yield put(actions.alerts.displaySuccess('Account successfully created!'))
      } else {
        yield put(A.coinifySignupFailure(profile.error))
      }
    } catch (e) {
      yield put(actions.alerts.displayError('Error creating account'))
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

      console.log('go to step after buy resolves with trade:', buyTrade)
      yield put(A.coinifyNotAsked())
      yield put(A.coinifyNextCheckoutStep('isx'))
    } catch (e) {
      console.warn('coinify buy FE saga error', e)
      // yield put(actions.alerts.displayError('Error buying.'))
    }
  }

  const sell = function * (payload) {
    try {
      const sellTrade = yield call(coreSagas.data.coinify.sell, payload)

      if (!sellTrade) {
        const trade = yield select(selectors.core.data.coinify.getTrade)
        const parsed = JSON.parse(trade.error)

        yield put(A.coinifyFailure(parsed))
        return
      }

      console.log('go to step after sell resolves with trade:', sellTrade)
      yield put(A.coinifyNotAsked())
      yield put(A.coinifyNextCheckoutStep('isx'))
    } catch (e) {
      console.warn('coinify sell FE saga error', e)
      // yield put(actions.alerts.displayError('Error selling.'))
    }
  }

  const initialized = function * () {
    try {
      const level = yield select(selectors.core.data.coinify.getLevel)
      const currencyR = level.map(l => l.currency)

      const initialValues = {
        leftVal: '',
        rightVal: '',
        currency: currencyR.getOrElse('EUR')
      }

      yield put(actions.form.initialize('coinifyCheckout', initialValues))
      yield put(actions.core.data.coinify.fetchRateQuote(currencyR.getOrElse('EUR')))
      yield put(A.coinifyCheckoutBusyOn())
    } catch (e) {
      console.log('initialize coinify checkout form', e)
    }
  }

  const handleChange = function * (action) {
    try {
      yield put(A.clearCoinifyCheckoutError())

      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals('coinifyCheckout', form)) return
      yield put(A.coinifyCheckoutBusyOn())

      const limits = yield select(selectors.core.data.coinify.getLimits)

      const values = yield select(selectors.form.getFormValues('coinifyCheckout'))
      // console.log('handleChange', action, form, values)

      if (!payload) return null

      switch (field) {
        case 'leftVal':
          const leftLimitsError = service.getLimitsError(payload, limits.data, values.currency)
          if (leftLimitsError) {
            yield put(A.setCoinifyCheckoutError(leftLimitsError))
            return
          }
          const leftResult = yield call(coreSagas.data.coinify.fetchQuote, { quote: { amount: payload * 100, baseCurrency: values.currency, quoteCurrency: 'BTC' } })
          const amount = leftResult.quoteAmount
          yield put(actions.form.initialize('coinifyCheckout', merge(values, { 'rightVal': amount / 1e8 })))
          yield put(A.coinifyCheckoutBusyOff())
          break
        case 'rightVal':
          const rightResult = yield call(coreSagas.data.coinify.fetchQuote, { quote: { amount: Math.round((payload * 1e8) * -1), baseCurrency: 'BTC', quoteCurrency: values.currency } })
          const fiatAmount = Math.abs(rightResult.quoteAmount)

          const rightLimitsError = service.getLimitsError(fiatAmount, limits.data, values.currency)
          if (rightLimitsError) {
            yield put(A.setCoinifyCheckoutError(rightLimitsError))
            yield put(actions.form.initialize('coinifyCheckout', merge(values, { 'leftVal': fiatAmount })))
            return
          }
          yield put(actions.form.initialize('coinifyCheckout', merge(values, { 'leftVal': fiatAmount })))
          yield put(A.coinifyCheckoutBusyOff())
          break
        case 'currency':
          yield put(actions.core.data.coinify.fetchRateQuote(payload))
          yield put(actions.form.initialize('coinifyCheckout', merge(values, { 'leftVal': '', 'rightVal': '' })))
          yield put(A.coinifyCheckoutBusyOn())
          break
      }
    } catch (e) {
      console.log(e)
    }
  }

  const setCheckoutMax = function * (action) {
    try {
      yield put(actions.form.change('coinifyCheckout', 'leftVal', action.payload))
    } catch (e) {
      console.log(e)
    }
  }

  const fromISX = function * (action) {
    const status = action.payload
    try {
      yield put(A.coinifyNextCheckoutStep('checkout'))
      const trade = yield select(selectors.core.data.coinify.getTrade)
      console.log('fromISX', status, trade)
      yield put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
      yield put(actions.modals.showModal('CoinifyTradeDetails', { trade: trade.data, status: status }))
      // TODO: open trade details modal with trade data and isx status
    } catch (e) {
      console.log('error fromISX', e)
    }
  }

  const triggerKYC = function * () {
    try {
      const kyc = yield call(coreSagas.data.coinify.triggerKYC)
      yield put(A.coinifyNextCheckoutStep('isx'))
      console.log('FE triggerKYC', kyc)
    } catch (e) {
      console.log('failed to triggerKYC', e)
    }
  }

  return {
    handleChange,
    // resetCoinifyCheckout,
    initialized,
    buy,
    sell,
    coinifySaveMedium,
    coinifySignup,
    setCheckoutMax,
    fromISX,
    triggerKYC
  }
}
