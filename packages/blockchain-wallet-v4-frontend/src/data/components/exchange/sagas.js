import { Remote, Exchange, utils } from 'blockchain-wallet-v4/src'
import { call, cancel, fork, select, take, takeEvery, takeLatest, put } from 'redux-saga/effects'
import { compose, concat, equals, identity, isNil, lift, filter, find, has, head, map, merge, nth, path, prop, propEq, toLower } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as actions from '../../actions'
import * as actionTypes from '../../actionTypes'
import * as selectors from '../../selectors'
import settings from 'config'
import { getPairFromCoin, getMinimum, getMaximum } from './services'
import { getActiveBchAccounts, getActiveBtcAccounts, getActiveEthAccounts, getBtcAccounts } from '../utils/sagas'

export default ({ api, coreSagas }) => {
  const shape = acc => ({
    text: acc.text,
    value: acc
  })

  const createBchPayment = function * (source) {
    yield put(A.firstStepDisabled())
    let payment = coreSagas.payment.bch.create(({ network: settings.NETWORK_BCH }))
    payment = yield payment.init()
    payment = yield payment.fee('priority')
    payment = yield payment.from(source)
    yield put(A.paymentUpdated(payment.value()))
    yield put(A.firstStepEnabled())
  }

  const createBtcPayment = function * (source) {
    yield put(A.firstStepDisabled())
    let payment = coreSagas.payment.btc.create(({ network: settings.NETWORK_BITCOIN }))
    payment = yield payment.init()
    payment = yield payment.fee('priority')
    payment = yield payment.from(source)
    yield put(A.paymentUpdated(payment.value()))
    yield put(A.firstStepEnabled())
  }

  const createEthPayment = function * (source) {
    yield put(A.firstStepDisabled())
    let payment = coreSagas.payment.eth.create(({ network: settings.NETWORK_ETHEREUM }))
    payment = yield payment.init()
    payment = yield payment.from(source)
    yield put(A.paymentUpdated(payment.value()))
    yield put(A.firstStepEnabled())
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
      yield createBtcPayment(defaultBtcAccountIndex)
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
      yield put(actions.form.change('exchange', 'source', target))
      yield put(actions.form.change('exchange', 'target', source))
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
      yield console.log('CHANGE', form, field, value)
      switch (field) {
        case 'source': yield fork(changeSource, value); break
        case 'sourceAmount': yield call(changeAmount, value, field); break
        case 'sourceFiat': yield call(changeAmount, value, field); break
        case 'targetAmount': yield call(changeAmount, value, field); break
        case 'targetFiat': yield call(changeAmount, value, field); break
      }
    } catch (e) {
      console.log(e)
    }
  }

  const changeSource = function * (from) {
    const { coin, value } = from
    switch (coin) {
      case 'BCH': return yield fork(createBchPayment, value)
      case 'BTC': return yield fork(createBtcPayment, value)
      case 'ETH': return yield fork(createEthPayment, value)
    }
  }

  const changeAmount = function * () {
    
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

  // let tradeStatusTask = null

  // const tradeStatus = function * (address) {
  // while (true) {
  // const tradeStatusData = yield call(api.getTradeStatus, address)
  // const tradeStatus = yield select(selectors.core.kvStore.shapeShift.getTrade, address)
  // yield call(delay, 10000)
  // }
  // }

  // const validateForm = function * (values) {
  //   const source = prop('source', values)
  //   const sourceCoin = prop('coin', source)
  //   const target = prop('target', values)
  //   const targetCoin = prop('coin', target)
  //   const amount = prop('sourceAmount', values)
  //   const pair = getPairFromCoin(sourceCoin, targetCoin)
  //   const effectiveBalance = yield call(calculateEffectiveBalance, source)
  //   const { minimum, maximum } = yield call(selectShapeshiftPair, pair)
  //   switch (true) {
  //     case greaterThan(amount, effectiveBalance): return yield put(A.firstStepError('effective_balance', effectiveBalance))
  //     case lessThan(amount, minimum): return yield put(A.firstStepError('shapeshift_minimum', minimum))
  //     case greaterThan(amount, maximum): return yield put(A.firstStepError('shapeshift_maximum', maximum))
  //   }
  //   return yield put(A.firstStepError(''))
  // }

  // const convertValues = function * (values, type) {
  //   const source = prop('source', values)
  //   const sourceCoin = prop('coin', source)
  //   const target = prop('target', values)
  //   const targetCoin = prop('coin', target)
  //   const sourceRates = yield call(selectRates, sourceCoin)
  //   const targetRates = yield call(selectRates, targetCoin)
  //   const pair = getPairFromCoin(sourceCoin, targetCoin)

  //   switch (type) {
  //     case 'sourceFiat': {
  //       const sourceFiat = prop('sourceFiat', values)
  //       const sourceAmount = Exchange.convertFiatToCoin(sourceFiat, 'USD', sourceCoin, sourceCoin, sourceRates).value
  //       const quotation = yield call(api.createQuote, sourceAmount, pair, true)
  //       const targetAmount = path(['success', 'withdrawalAmount'], quotation) || 0
  //       const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
  //       return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
  //     }
  //     case 'targetAmount': {
  //       const targetAmount = prop('targetAmount', values)
  //       const quotation = yield call(api.createQuote, targetAmount, pair, false)
  //       const sourceAmount = path(['success', 'depositAmount'], quotation) || 0
  //       const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
  //       const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
  //       return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
  //     }
  //     case 'targetFiat': {
  //       const targetFiat = prop('targetFiat', values)
  //       const targetAmount = Exchange.convertFiatToCoin(targetFiat, 'USD', targetCoin, targetCoin, targetRates).value
  //       const quotation = yield call(api.createQuote, targetAmount, pair, false)
  //       const sourceAmount = path(['success', 'depositAmount'], quotation) || 0
  //       const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
  //       return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
  //     }
  //     case 'sourceAmount':
  //     default: {
  //       const sourceAmount = prop('sourceAmount', values)
  //       const quotation = yield call(api.createQuote, sourceAmount, pair, true)
  //       const targetAmount = path(['success', 'withdrawalAmount'], quotation) || 0
  //       const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
  //       const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
  //       return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
  //     }
  //   }
  // }

  const destroyed = function * () {
    yield put(actions.form.destroy('exchange'))
  }

  return function * () {
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_INITIALIZED, firstStepInitialized)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_SWAP_CLICKED, swapClicked)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_MINIMUM_CLICKED, minimumClicked)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_MAXIMUM_CLICKED, maximumClicked)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_SUBMIT_CLICKED, firstStepSubmitClicked)
    // yield takeLatest(AT.EXCHANGE_SECOND_STEP_INITIALIZED, secondStepInitialized)
    // yield takeLatest(AT.EXCHANGE_THIRD_STEP_INITIALIZED, thirdStepInitialized)
    // yield takeEvery(AT.EXCHANGE_SECOND_STEP_CANCEL_CLICKED, destroyed)
    // yield takeEvery(AT.EXCHANGE_SECOND_STEP_ORDER_EXPIRED, destroyed)
    // yield takeEvery(AT.EXCHANGE_THIRD_STEP_CLOSE_CLICKED, destroyed)
    yield takeLatest(AT.EXCHANGE_DESTROYED, destroyed)
    yield takeEvery(actionTypes.form.CHANGE, change)
  }
}
