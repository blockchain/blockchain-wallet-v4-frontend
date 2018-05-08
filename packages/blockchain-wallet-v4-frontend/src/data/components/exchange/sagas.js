import { cancel, cancelled, delay, identity, call, fork, select, put } from 'redux-saga/effects'
import { equals, has, merge, path, prop } from 'ramda'
import * as A from './actions'
import * as S from './selectors'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import { promptForSecondPassword } from 'services/SagaService'
import { getCoinFromPair, getPairFromCoin, getMinimum, getMaximum,
  convertStandardToBase, isAmountBelowMinimum, isAmountAboveMaximum, calculateFinalAmount, selectFee,
  isUndefinedOrEqualsToZero, getMinimumStandard, getMaximumStandard } from './services'
import { selectReceiveAddress } from '../utils/sagas'
import utils from './sagas.utils'

export default ({ api, coreSagas }) => {
  const logLocation = 'components/exchange/sagas'
  const {
    calculateEffectiveBalance,
    createPayment,
    resumePayment,
    getShapeShiftLimits,
    convertValues,
    selectOtherAccount
  } = utils({ api, coreSagas })
  let pollingTradeStatusTask

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
      yield put(actions.logs.logErrorMessage(logLocation, 'firstStepInitialized', e))
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
      yield put(actions.logs.logErrorMessage(logLocation, 'swapClicked', e))
    }
  }

  const minimumClicked = function * () {
    try {
      const form = yield select(selectors.form.getFormValues('exchange'))
      const source = prop('source', form)
      const target = prop('target', form)
      const pair = yield call(getShapeShiftLimits, source, target)
      const minimum = getMinimumStandard(prop('minimum', pair))
      yield put(actions.form.change('exchange', 'sourceAmount', minimum))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'minimumClicked', e))
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
      const maximum = getMaximumStandard(coin, prop('maximum', pair), effectiveBalance)
      yield put(actions.form.change('exchange', 'sourceAmount', maximum))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'maximumClicked', e))
    }
  }

  const change = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      if (!equals('exchange', form)) return
      switch (field) {
        case 'source': yield call(changeSource); break
        case 'target': yield call(changeTarget); break
        case 'sourceAmount': yield call(changeAmount, field); break
        case 'sourceFiat': yield call(changeAmount, field); break
        case 'targetAmount': yield call(changeAmount, field); break
        case 'targetFiat': yield call(changeAmount, field); break
      }
      yield call(validateForm)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'change', e))
    }
  }

  const changeSource = function * () {
    const form = yield select(selectors.form.getFormValues('exchange'))
    const source = prop('source', form)
    const sourceCoin = prop('coin', source)
    const target = prop('target', form)
    const targetCoin = prop('coin', target)
    if (equals(sourceCoin, targetCoin)) {
      const newTarget = yield call(selectOtherAccount, targetCoin)
      const newValues = merge(form, { target: newTarget })
      yield put(actions.form.initialize('exchange', newValues))
    }
  }

  const changeTarget = function * () {
    const form = yield select(selectors.form.getFormValues('exchange'))
    const source = prop('source', form)
    const sourceCoin = prop('coin', source)
    const target = prop('target', form)
    const targetCoin = prop('coin', target)

    if (equals(sourceCoin, targetCoin)) {
      const newSource = yield call(selectOtherAccount, sourceCoin)
      const newValues = merge(form, { source: newSource })
      yield put(actions.form.initialize('exchange', newValues))
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
    try {
      yield put(A.firstStepDisabled())
      const form = yield select(selectors.form.getFormValues('exchange'))
      const source = prop('source', form)
      const target = prop('target', form)
      const sourceAmount = prop('sourceAmount', form)
      if (isUndefinedOrEqualsToZero(sourceAmount)) {
        return yield put(A.firstStepEnabled())
      }
      const effectiveBalance = yield call(calculateEffectiveBalance, source)
      const pair = yield call(getShapeShiftLimits, source, target)
      const minimum = getMinimum(source.coin, pair.minimum)
      const maximum = getMaximum(source.coin, pair.maximum, effectiveBalance)
      const sourceAmountBase = convertStandardToBase(source.coin, sourceAmount)
      if (isAmountBelowMinimum(effectiveBalance, minimum)) {
        yield put(A.firstStepFormUnvalidated('insufficient'))
      } else if (isAmountBelowMinimum(sourceAmountBase, minimum)) {
        yield put(A.firstStepFormUnvalidated('minimum'))
      } else if (isAmountAboveMaximum(sourceAmountBase, maximum)) {
        yield put(A.firstStepFormUnvalidated('maximum'))
      } else {
        yield put(A.firstStepFormValidated())
      }
      yield put(A.firstStepEnabled())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'validateForm', e))
    }
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
      yield put(A.secondStepFailure('An error has occurred.'))
      yield put(actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', e))
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
      // We update the payment in the state
      yield put(A.secondStepPaymentSent(paymentValue))
    } catch (e) {
      yield put(actions.alerts.displayError('The transaction failed to send. Please try again later.'))
      yield put(actions.logs.logErrorMessage(logLocation, 'secondStepSubmitClicked', e))
    }
  }

  const thirdStepInitialized = function * () {
    try {
      // Start polling trade status
      const order = yield select(S.getOrder)
      const depositAddress = prop('deposit', order)
      pollingTradeStatusTask = yield fork(startPollingTradeStatus, depositAddress)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'thirdStepInitialized', e))
    }
  }

  const startPollingTradeStatus = function * (depositAddress) {
    try {
      while (true) {
        const appState = yield select(identity)
        const currentTrade = selectors.core.kvStore.shapeShift.getTrade(depositAddress, appState).getOrFail('Could not find trade.')
        const currentStatus = prop('status', currentTrade)
        if (equals('complete', currentStatus) || equals('failed', currentStatus)) {
          break
        }
        const data = yield call(api.getTradeStatus, depositAddress)
        const shapeshiftStatus = prop('status', data)
        if (!equals(shapeshiftStatus, currentStatus)) {
          yield put(actions.core.kvStore.shapeShift.updateTradeStatusMetadataShapeshift(depositAddress, shapeshiftStatus))
        }
        yield call(delay, 5000)
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'startPollingTradeStatus', e))
      yield put(actions.alerts.displayError('Failed to refresh trade status.'))
    } finally {
      if (yield cancelled()) {
        yield put(actions.logs.logInfoMessage(logLocation, 'startPollingTradeStatus', 'trade polling cancelled'))
      }
    }
  }

  const stopPollingTradeStatus = function * () {
    yield cancel(pollingTradeStatusTask)
  }

  const destroyed = function * () {
    yield put(actions.form.destroy('exchange'))
    if (pollingTradeStatusTask) yield call(stopPollingTradeStatus)
  }

  return {
    firstStepInitialized,
    swapClicked,
    minimumClicked,
    maximumClicked,
    firstStepSubmitClicked,
    thirdStepInitialized,
    secondStepSubmitClicked,
    destroyed,
    change
  }
}
