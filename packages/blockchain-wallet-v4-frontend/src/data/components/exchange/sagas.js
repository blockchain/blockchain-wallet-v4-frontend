import { call, fork, select, takeEvery, takeLatest, put } from 'redux-saga/effects'
import { compose, equals, head, merge, nth, path, prop } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as actions from '../../actions'
import * as actionTypes from '../../actionTypes'
import * as selectors from '../../selectors'
import settings from 'config'
import { getPairFromCoin, getMinimum, getMaximum, convertFiatToCoin, convertCoinToFiat, isAmountAboveMinimum, isAmountBelowMaximum } from './services'
import { getActiveBchAccounts, getActiveBtcAccounts, getActiveEthAccounts, getBtcAccounts, selectRates } from '../utils/sagas'

export default ({ api, coreSagas }) => {
  // ===========================================================================
  // ================================= UTILS ===================================
  // ===========================================================================
  const shape = acc => ({
    text: acc.text,
    value: acc
  })

  const createBchPayment = function * (source) {
    let payment = coreSagas.payment.bch.create(({ network: settings.NETWORK_BCH }))
    payment = yield payment.init()
    payment = yield payment.fee('priority')
    return yield payment.from(source)
  }

  const createBtcPayment = function * (source) {
    let payment = coreSagas.payment.btc.create(({ network: settings.NETWORK_BITCOIN }))
    payment = yield payment.init()
    payment = yield payment.fee('priority')
    return yield payment.from(source)
  }

  const createEthPayment = function * (source) {
    let payment = coreSagas.payment.eth.create(({ network: settings.NETWORK_ETHEREUM }))
    payment = yield payment.init()
    return yield payment.from(source)
  }

  const getPair = function * (source, target) {
    const coinSource = prop('coin', source)
    const coinTarget = prop('coin', target)
    const pair = getPairFromCoin(coinSource, coinTarget)
    const shapeshiftPairR = yield select(selectors.core.data.shapeShift.getPair(pair))
    const shapeshiftPair = shapeshiftPairR.getOrFail('Could not find shapeshift pair.')

    return {
      minimum: prop('minimum', shapeshiftPair),
      maximum: prop('limit', shapeshiftPair)
    }
  }

  const convertValues = function * (values, type) {
    const source = prop('source', values)
    const sourceCoin = prop('coin', source)
    const target = prop('target', values)
    const targetCoin = prop('coin', target)
    const sourceRates = yield call(selectRates, sourceCoin)
    const targetRates = yield call(selectRates, targetCoin)
    const pair = getPairFromCoin(sourceCoin, targetCoin)

    switch (type) {
      case 'sourceFiat': {
        const sourceFiat = prop('sourceFiat', values)
        const sourceAmount = convertFiatToCoin(sourceFiat, 'USD', sourceCoin, sourceCoin, sourceRates).value
        const quotation = yield call(api.createQuote, sourceAmount, pair, true)
        const targetAmount = path(['success', 'withdrawalAmount'], quotation) || 0
        const targetFiat = convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
        return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
      }
      case 'targetAmount': {
        const targetAmount = prop('targetAmount', values)
        const quotation = yield call(api.createQuote, targetAmount, pair, false)
        const sourceAmount = path(['success', 'depositAmount'], quotation) || 0
        const sourceFiat = convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
        const targetFiat = convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
        return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
      }
      case 'targetFiat': {
        const targetFiat = prop('targetFiat', values)
        const targetAmount = convertFiatToCoin(targetFiat, 'USD', targetCoin, targetCoin, targetRates).value
        const quotation = yield call(api.createQuote, targetAmount, pair, false)
        const sourceAmount = path(['success', 'depositAmount'], quotation) || 0
        const sourceFiat = convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
        return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
      }
      case 'sourceAmount':
      default: {
        const sourceAmount = prop('sourceAmount', values)
        const quotation = yield call(api.createQuote, sourceAmount, pair, true)
        const targetAmount = path(['success', 'withdrawalAmount'], quotation) || 0
        const sourceFiat = convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
        const targetFiat = convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
        return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
      }
    }
  }
  // ===========================================================================
  // ===========================================================================
  // ===========================================================================

  const firstStepInitialized = function * () {
    try {
      yield put(A.firstStepDisabled())
      // Fetch data
      yield put(actions.core.data.bch.fetchRates())
      yield put(actions.core.data.bitcoin.fetchRates())
      yield put(actions.core.data.ethereum.fetchRates())
      yield put(actions.core.data.shapeShift.fetchPair('bch_btc'))
      yield put(actions.core.data.shapeShift.fetchPair('bch_eth'))
      yield put(actions.core.data.shapeShift.fetchPair('btc_bch'))
      yield put(actions.core.data.shapeShift.fetchPair('btc_eth'))
      yield put(actions.core.data.shapeShift.fetchPair('eth_bch'))
      yield put(actions.core.data.shapeShift.fetchPair('eth_btc'))
      // Prepare accounts for the dropdowns
      const btcAccounts = yield call(getBtcAccounts)
      const activeBchAccounts = yield call(getActiveBchAccounts)
      const activeBtcAccounts = yield call(getActiveBtcAccounts)
      const activeEthAccounts = yield call(getActiveEthAccounts)
      const elements = [
        { group: 'Bitcoin', items: activeBchAccounts.map(shape) },
        { group: 'Bitcoin cash', items: activeBtcAccounts.map(shape) },
        { group: 'Ethereum', items: activeEthAccounts.map(shape) }
      ]
      yield put(A.accountsUpdated(elements))
      // Initialize payment with default values
      const defaultBtcAccountIndex = yield select(selectors.core.wallet.getDefaultAccountIndex)
      const payment = yield createBtcPayment(defaultBtcAccountIndex)
      yield put(A.paymentUpdated(payment.value()))
      // Initialize form with default values
      const defaultBtcAccount = compose(shape, nth(defaultBtcAccountIndex))(btcAccounts)
      const defaultEthAccount = head(activeEthAccounts.map(shape))
      const initialValues = {
        source: prop('value', defaultBtcAccount),
        target: prop('value', defaultEthAccount)
      }
      yield put(actions.form.initialize('exchange', initialValues))
      yield put(A.firstStepEnabled())
    } catch (e) {
      console.log('e', e)
      // yield put(A.firstStepError('Could not load exchange page.'))
    }
  }

  const swapClicked = function * () {
    try {
      const form = yield select(selectors.form.getFormValues('exchange'))
      const source = prop('source', form)
      const target = prop('target', form)
      const values = merge(form, { source: target, target: source })
      const newValues = yield call(convertValues, values)
      console.log('newValue', newValues)
      yield put(actions.form.initialize('exchange', newValues))
      yield put(actions.form.change('exchange', 'target', source))
      yield put(actions.form.change('exchange', 'source', target))
    } catch (e) {
      console.log(e)
    }
  }

  const minimumClicked = function * () {
    try {
      const form = yield select(selectors.form.getFormValues('exchange'))
      const source = prop('source', form)
      const target = prop('target', form)
      const coin = prop('coin', source)
      const pair = yield call(getPair, source, target)
      const minimum = getMinimum(coin, pair.minimum)
      yield put(actions.form.change('exchange', 'sourceAmount', minimum))
    } catch (e) {
      console.log(e)
    }
  }

  const maximumClicked = function * () {
    try {
      const form = yield select(selectors.form.getFormValues('exchange'))
      const source = prop('source', form)
      const target = prop('target', form)
      const coin = prop('coin', source)
      const payment = yield select(S.getPayment)
      const effectiveBalance = prop('effectiveBalance', payment)
      const pair = yield call(getPair, source, target)
      const maximum = getMaximum(coin, pair.maximum, effectiveBalance)
      yield put(actions.form.change('exchange', 'sourceAmount', maximum))
    } catch (e) {
      console.log(e)
    }
  }

  const change = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const value = prop('payload', action)
      if (!equals('exchange', form)) return
      // yield console.log('CHANGE', form, field, value)
      switch (field) {
        case 'source': yield fork(changeSource, value); break
        case 'sourceAmount': yield call(changeAmount, field); break
        case 'sourceFiat': yield call(changeAmount, field); break
        case 'targetAmount': yield call(changeAmount, field); break
        case 'targetFiat': yield call(changeAmount, field); break
      }
      yield call(validateForm)
    } catch (e) {
      console.log(e)
    }
  }

  const changeSource = function * (source) {
    yield put(A.firstStepDisabled())
    // We create the payment
    let payment
    switch (source.coin) {
      case 'BCH': payment = yield call(createBchPayment, source.value); break
      case 'BTC': payment = yield call(createBtcPayment, source.value); break
      case 'ETH': payment = yield call(createEthPayment, source.value); break
    }
    yield put(A.paymentUpdated(payment.value()))
    yield put(A.firstStepEnabled())
  }

  const changeAmount = function * (type) {
    yield put(A.firstStepDisabled())
    const values = yield select(selectors.form.getFormValues('exchange'))
    const newValues = yield call(convertValues, values, type)
    yield put(actions.form.initialize('exchange', newValues))
    yield put(A.firstStepEnabled())
  }

  const validateForm = function * () {
    console.log('validateForm')
    const payment = yield select(S.getPayment)
    console.log('payment', payment)
    const effectiveBalance = prop('effectiveBalance', payment)
    console.log('effectiveBalance', effectiveBalance)
    const form = yield select(selectors.form.getFormValues('exchange'))
    const source = prop('source', form)
    console.log('source', source)
    const target = prop('target', form)
    console.log('target', target)
    const sourceAmount = prop('sourceAmount', form)
    console.log('sourceAmount', sourceAmount)
    const pair = yield call(getPair, source, target)
    console.log('pair', pair)
    const minimum = getMinimum(source.coin, pair.minimum)
    console.log('minimum', minimum)
    const maximum = getMaximum(source.coin, pair.maximum, effectiveBalance)
    console.log('maximum', maximum)
    if (!isAmountAboveMinimum(sourceAmount, minimum) && !isAmountBelowMaximum(sourceAmount, maximum)) {
      return yield put(A.firstStepFormUnvalidated('insufficient'))
    }
    if (!isAmountAboveMinimum(sourceAmount, minimum)) {
      return yield put(A.firstStepFormUnvalidated('minimum'))
    }
    if (!isAmountBelowMaximum(sourceAmount, maximum)) {
      return yield put(A.firstStepFormUnvalidated('maximum'))
    }
    return yield put(A.firstStepFormValidated())
  }

  const firstStepSubmitClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      let payment = coreSagas.payment.bch.create({ payment: p.getOrElse({}), network: settings.NETWORK_BCH })
      const form = yield select(selectors.form.getFormValues('exchange'))
      console.log('form', form)
      console.log('payment', payment)
      // payment = yield payment.to()
      // payment = yield payment.amount(prop('sourceAmount', form))
      // payment = yield payment.build()
      // yield put(A.paymentUpdated(payment))
    } catch (e) {
      console.log(e)
    }
  }

  const secondStepInitialized = function * () {
    try {
      // const form = yield select(selectors.form.getFormValues('exchange'))
      // const source = prop('source', form)
      // const sourceCoin = prop('coin', source)
      // const sourceAmount = prop('sourceAmount', form)
      // const target = prop('target', form)
      // const targetCoin = prop('coin', target)
      // const pair = getPairFromCoin(sourceCoin, targetCoin)
      // const returnAddress = yield call(selectReceiveAddress, source)
      // const withdrawalAddress = yield call(selectReceiveAddress, target)
      // const orderData = yield call(api.createOrder, sourceAmount, pair, returnAddress, withdrawalAddress)
      // if (!has('success', orderData)) throw new Error('Shapeshift order could not be placed.')
      // const order = prop('success', orderData)
      // let fee
      // switch (sourceCoin) {
      // case 'BTC': fee = yield call(calculateBtcFee, source, sourceAmount, prop('deposit', order)); break
      // case 'ETH': fee = yield call(calculateEthFee); break
      // }
      // yield put(A.secondStepSuccess({ order, fee }))
      // return order
      yield
    } catch (e) {
      console.log(e)
    }
  }

  const thirdStepInitialized = function * () {
    try {
      yield
    } catch (e) {
      console.log(e)
    }
  }

  const destroyed = function * () {
    yield put(actions.form.destroy('exchange'))
  }

  return function * () {
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_INITIALIZED, firstStepInitialized)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_SWAP_CLICKED, swapClicked)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_MINIMUM_CLICKED, minimumClicked)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_MAXIMUM_CLICKED, maximumClicked)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_SUBMIT_CLICKED, firstStepSubmitClicked)
    yield takeLatest(AT.EXCHANGE_SECOND_STEP_INITIALIZED, secondStepInitialized)
    yield takeLatest(AT.EXCHANGE_THIRD_STEP_INITIALIZED, thirdStepInitialized)
    // yield takeEvery(AT.EXCHANGE_SECOND_STEP_CANCEL_CLICKED, destroyed)
    // yield takeEvery(AT.EXCHANGE_SECOND_STEP_ORDER_EXPIRED, destroyed)
    // yield takeEvery(AT.EXCHANGE_THIRD_STEP_CLOSE_CLICKED, destroyed)
    yield takeLatest(AT.EXCHANGE_DESTROYED, destroyed)
    yield takeEvery(actionTypes.form.CHANGE, change)
  }
}
