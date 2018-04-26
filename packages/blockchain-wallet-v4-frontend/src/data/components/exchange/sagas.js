import { call, cancel, cancelled, fork, select, takeLatest, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { equals, identity, has, merge, path, prop } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as actions from '../../actions'
import * as actionTypes from '../../actionTypes'
import * as selectors from '../../selectors'
import settings from 'config'
import { promptForSecondPassword } from 'services/SagaService'
import { getCoinFromPair, getPairFromCoin, getMinimum, getMaximum, convertFiatToCoin, convertCoinToFiat,
  convertStandardToBase, isAmountAboveMinimum, isAmountBelowMaximum, calculateFinalAmount, selectFee,
  isUndefinedOrEqualsToZero } from './services'
import { selectRates, selectReceiveAddress } from '../utils/sagas'

export default ({ api, coreSagas }) => {
  // ===========================================================================
  // ================================= UTILS ===================================
  // ===========================================================================
  const calculateEffectiveBalance = function * (source) {
    const coin = prop('coin', source)
    const address = prop('address', source)
    let payment
    switch (coin) {
      case 'BCH':
        payment = yield coreSagas.payment.bch.create({ network: settings.NETWORK_BCH }).chain().init().fee('priority').from(address).done()
        break
      case 'BTC':
        payment = yield coreSagas.payment.btc.create({ network: settings.NETWORK_BITCOIN }).chain().init().fee('priority').from(address).done()
        break
      case 'ETH':
        payment = yield coreSagas.payment.eth.create({ network: settings.NETWORK_ETHEREUM }).chain().init().from(address).done()
        break
      default: throw new Error('Could not get effective balance.')
    }
    return prop('effectiveBalance', payment.value())
  }

  const createPayment = function * (coin, sourceAddress, targetAddress, amount) {
    let payment
    switch (coin) {
      case 'BCH':
        payment = coreSagas.payment.bch.create({ network: settings.NETWORK_BCH }).chain().init().fee('priority').amount(parseInt(amount))
        break
      case 'BTC':
        payment = coreSagas.payment.btc.create({ network: settings.NETWORK_BITCOIN }).chain().init().fee('priority').amount(parseInt(amount))
        break
      case 'ETH':
        payment = coreSagas.payment.eth.create({ network: settings.NETWORK_ETHEREUM }).chain().init().amount(amount)
        break
      default: throw new Error('Could not create payment.')
    }
    payment = yield payment.from(sourceAddress).to(targetAddress).build().done()
    console.log('createPayment', payment.value)
    return payment
  }

  const resumePayment = function (coin, payment) {
    switch (coin) {
      case 'BCH': return coreSagas.payment.bch.create({ payment, network: settings.NETWORK_BCH })
      case 'BTC': return coreSagas.payment.btc.create({ payment, network: settings.NETWORK_BITCOIN })
      case 'ETH': return coreSagas.payment.eth.create({ payment, network: settings.NETWORK_ETHEREUM })
      default: throw new Error('Could not resume payment.')
    }
  }

  const getShapeShiftLimits = function * (source, target) {
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
    const defaultResult = { source, target, sourceAmount: 0, sourceFiat: 0, targetAmount: 0, targetFiat: 0 }

    switch (type) {
      case 'sourceFiat': {
        const sourceFiat = prop('sourceFiat', values)
        if (isUndefinedOrEqualsToZero(sourceFiat)) return defaultResult
        const sourceAmount = convertFiatToCoin(sourceFiat, 'USD', sourceCoin, sourceCoin, sourceRates).value
        const quotation = yield call(api.createQuote, sourceAmount, pair, true)
        const targetAmount = path(['success', 'withdrawalAmount'], quotation) || 0
        const targetFiat = convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
        return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
      }
      case 'targetAmount': {
        const targetAmount = prop('targetAmount', values)
        if (isUndefinedOrEqualsToZero(targetAmount)) return defaultResult
        const quotation = yield call(api.createQuote, targetAmount, pair, false)
        const sourceAmount = path(['success', 'depositAmount'], quotation) || 0
        const sourceFiat = convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
        const targetFiat = convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
        return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
      }
      case 'targetFiat': {
        const targetFiat = prop('targetFiat', values)
        if (isUndefinedOrEqualsToZero(targetFiat)) return defaultResult
        const targetAmount = convertFiatToCoin(targetFiat, 'USD', targetCoin, targetCoin, targetRates).value
        const quotation = yield call(api.createQuote, targetAmount, pair, false)
        const sourceAmount = path(['success', 'depositAmount'], quotation) || 0
        const sourceFiat = convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
        return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
      }
      case 'sourceAmount':
      default: {
        const sourceAmount = prop('sourceAmount', values)
        if (isUndefinedOrEqualsToZero(sourceAmount)) return defaultResult
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
    } catch (e) {
      console.log(e)
    }
  }

  const swapClicked = function * () {
    try {
      const form = yield select(selectors.form.getFormValues('exchange'))
      const source = prop('source', form)
      const target = prop('target', form)
      const values = merge(form, { source: target, target: source })
      const newValues = yield call(convertValues, values)
      yield put(actions.form.initialize('exchange', newValues))
      yield call(validateForm)
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
      const pair = yield call(getShapeShiftLimits, source, target)
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
      const effectiveBalance = yield call(calculateEffectiveBalance, source)
      const pair = yield call(getShapeShiftLimits, source, target)
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
      if (!equals('exchange', form)) return
      switch (field) {
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

  const changeAmount = function * (type) {
    yield put(A.firstStepDisabled())
    const values = yield select(selectors.form.getFormValues('exchange'))
    const newValues = yield call(convertValues, values, type)
    yield put(actions.form.initialize('exchange', newValues))
    yield put(A.firstStepEnabled())
  }

  const validateForm = function * () {
    yield put(A.firstStepDisabled())
    const form = yield select(selectors.form.getFormValues('exchange'))
    const source = prop('source', form)
    const target = prop('target', form)
    const sourceAmount = prop('sourceAmount', form)
    if (isEqualsToZero(sourceAmount)) {
      yield put(A.firstStepFormUnvalidated('insufficient'))
      return yield put(A.firstStepEnabled())
    }
    const effectiveBalance = yield call(calculateEffectiveBalance, source)
    const pair = yield call(getShapeShiftLimits, source, target)
    const minimum = getMinimum(source.coin, pair.minimum)
    const maximum = getMaximum(source.coin, pair.maximum, effectiveBalance)
    if (!isAmountAboveMinimum(sourceAmount, minimum) && !isAmountBelowMaximum(sourceAmount, maximum)) {
      yield put(A.firstStepFormUnvalidated('insufficient'))
    } else if (!isAmountAboveMinimum(sourceAmount, minimum)) {
      yield put(A.firstStepFormUnvalidated('minimum'))
    } else if (!isAmountBelowMaximum(sourceAmount, maximum)) {
      yield put(A.firstStepFormUnvalidated('maximum'))
    } else {
      yield put(A.firstStepFormValidated())
    }
    yield put(A.firstStepEnabled())
  }

  const firstStepSubmitClicked = function * () {
    try {
      const form = yield select(selectors.form.getFormValues('exchange'))
      const source = prop('source', form)
      const target = prop('target', form)
      const sourceCoin = prop('coin', source)
      const targetCoin = prop('coin', target)
      const sourceAddress = prop('address', source)
      const amount = prop('sourceAmount', form)
      const returnAddress = yield call(selectReceiveAddress, source)
      const withdrawalAddress = yield call(selectReceiveAddress, target)
      // Shapeshift order
      const pair = getPairFromCoin(sourceCoin, targetCoin)
      const orderData = yield call(api.createOrder, amount, pair, returnAddress, withdrawalAddress)
      if (!has('success', orderData)) throw new Error('Shapeshift order could not be placed.')
      const order = prop('success', orderData)
      yield put(A.orderUpdated(order))
      // Create final payment
      const depositAddress = prop('deposit', order)
      const depositAmount = prop('depositAmount', order)
      const sourceAmount = convertStandardToBase(sourceCoin, depositAmount)
      const finalPayment = yield call(createPayment, sourceCoin, sourceAddress, depositAddress, sourceAmount)
      yield put(A.paymentUpdated(finalPayment.value()))
      // Prepare data for confirmation screen
      const sourceFee = selectFee(sourceCoin, finalPayment.value())
      const sourceTotal = calculateFinalAmount(sourceAmount, sourceFee)
      const data = {
        sourceCoin,
        sourceAmount,
        sourceFee,
        sourceTotal,
        exchangeRate: `1 ${sourceCoin} = ${prop('quotedRate', order)} ${targetCoin}`,
        targetCoin,
        targetAmount: prop('withdrawalAmount', order),
        targetFee: prop('minerFee', order),
        expiration: prop('expiration', order),
        withdrawalAddress
      }
      yield put(A.secondStepSuccess(data))
    } catch (e) {
      yield put(A.secondStepFailure('An error has occured.'))
    }
  }

  const secondStepSubmitClicked = function * () {
    try {
      const payment = yield select(S.getPayment)
      const order = yield select(S.getOrder)
      // Do the transaction to the deposit address
      const { coinSource } = getCoinFromPair(prop('pair', order))
      let outgoingPayment = resumePayment(coinSource, payment)
      const password = yield call(promptForSecondPassword)
      outgoingPayment = yield outgoingPayment.sign(password)
      outgoingPayment = yield outgoingPayment.publish()
      const paymentValue = outgoingPayment.value()
      const { txId } = paymentValue
      yield put(A.paymentUpdated(paymentValue))
      // Save the trade in metadata
      const trade = {
        hashIn: txId,
        timestamp: new Date().getTime(),
        status: 'no_deposits',
        quote: {
          orderId: prop('orderId', order),
          quotedRate: prop('quotedRate', order),
          deposit: prop('deposit', order),
          minerFee: prop('minerFee', order),
          pair: prop('pair', order),
          depositAmount: prop('depositAmount', order),
          withdrawal: prop('withdrawal', order),
          withdrawalAmount: prop('withdrawalAmount', order)
        }
      }
      // Add order in metadata
      yield put(actions.core.kvStore.shapeShift.addTradeMetadataShapeshift(trade))
    } catch (e) {
      yield put(actions.alerts.displayError('Transaction could not be sent. Try again later.'))
    }
  }

  const secondStepCancelClicked = function * () {
    try {
      yield 
    } catch (e) {

    }
  }

  const thirdStepInitialized = function * () {
    try {
      // Start polling trade status
      const order = yield select(S.getOrder)
      const depositAddress = prop('deposit', order)
      pollingTradeStatusTask = yield fork(startPollingTradeStatus, depositAddress)
    } catch (e) {
      console.log(e)
    }
  }

  let pollingTradeStatusTask

  const startPollingTradeStatus = function * (depositAddress) {
    try {
      while (true) {
        const appState = yield select(identity)
        const currentTrade = selectors.core.kvStore.shapeShift.getTrade(depositAddress, appState).getOrFail('Could not find trade.')
        const currentStatus = prop('status', currentTrade)
        if (equals('complete', currentStatus) || equals('failed', currentStatus)) {
          break
        }
        const data = yield call(coreSagas.data.shapeShift.fetchTradeStatus, depositAddress)
        const shapeshiftStatus = prop('status', data)
        if (!equals(shapeshiftStatus, currentStatus)) {
          yield put(actions.core.kvStore.shapeShift.updateTradeStatusMetadataShapeshift(depositAddress, shapeshiftStatus))
        }
        yield call(delay, 5000)
      }
    } catch (e) {
      console.log(e)
      yield put(actions.alerts.displayError('Could not refresh trade status.'))
    } finally {
      if (yield cancelled()) { console.log('cancelled') }
    }
  }

  const stopPollingTradeStatus = function * () {
    yield cancel(pollingTradeStatusTask)
  }

  const destroyed = function * () {
    yield put(actions.form.destroy('exchange'))
    if (pollingTradeStatusTask) yield call(stopPollingTradeStatus)
  }

  return function * () {
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_INITIALIZED, firstStepInitialized)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_SWAP_CLICKED, swapClicked)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_MINIMUM_CLICKED, minimumClicked)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_MAXIMUM_CLICKED, maximumClicked)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_SUBMIT_CLICKED, firstStepSubmitClicked)
    yield takeLatest(AT.EXCHANGE_SECOND_STEP_SUBMIT_CLICKED, secondStepSubmitClicked)
    yield takeLatest(AT.EXCHANGE_SECOND_STEP_CANCEL_CLICKED, secondStepCancelClicked)
    yield takeLatest(AT.EXCHANGE_THIRD_STEP_INITIALIZED, thirdStepInitialized)
    yield takeLatest(AT.EXCHANGE_DESTROYED, destroyed)
    yield takeLatest(actionTypes.form.CHANGE, change)
  }
}
