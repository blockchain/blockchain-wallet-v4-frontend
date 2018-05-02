import { put, call, select } from 'redux-saga/effects'
import * as A from './actions'
import * as actions from '../../actions'
import * as selectors from '../../selectors.js'
import { path, prop, equals, merge } from 'ramda'

export default ({ coreSagas }) => {
  const coinifySignup = function * () {
    try {
      yield call(coreSagas.data.coinify.signup)
      const profile = yield select(selectors.core.data.coinify.getProfile)
      if (!profile.error) {
        yield put(A.coinifyNextStep('isx'))
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
    yield put(A.coinifyNextStep('confirm'))
  }

  const buy = function * (payload) {
    try {
      yield call(coreSagas.data.coinify.buy, payload)
      yield put(actions.alerts.displaySuccess('Buy trade successfully created!'))
      yield put(A.coinifyNextStep('isx'))
    } catch (e) {
      yield put(actions.alerts.displayError('Error buying.'))
    }
  }
  const initialized = function * () {
    try {
      const initialValues = {

      }
      yield put(actions.form.initialize('coinifyCheckout', initialValues))
    } catch (e) {
    }
  }

  const resetCoinifyCheckout = function * () {
    console.log('resetCoinifyCheckout')
    try {
      yield put(actions.form.change('coinifyCheckout', 'leftVal', ''))
    } catch (e) {
      console.log('resetCoinifyCheckout Error', e)
    }
  }

  const handleChange = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals('coinifyCheckout', form)) return
      const values = yield select(selectors.form.getFormValues('coinifyCheckout'))
      console.log('handleChange', action, form, values)

      switch (field) {
        case 'leftVal':
          const leftResult = yield call(coreSagas.data.coinify.fetchQuote, { quote: { amt: payload, baseCurr: 'EUR', quoteCurr: 'BTC' } })
          const amount = leftResult.quoteAmount
          yield put(actions.form.initialize('coinifyCheckout', merge(values, { 'rightVal': amount })))
          break
        case 'rightVal':
          const rightResult = yield call(coreSagas.data.coinify.fetchQuote, { quote: { amt: payload * 1e8, baseCurr: 'BTC', quoteCurr: 'EUR' } })
          const fiatAmount = rightResult.quoteAmount
          yield put(actions.form.initialize('coinifyCheckout', merge(values, { 'leftVal': fiatAmount })))
          break
      }
    } catch (e) {

    }
  }

  return {
    handleChange,
    resetCoinifyCheckout,
    initialized,
    buy,
    coinifySaveMedium,
    coinifySignup
  }
}
