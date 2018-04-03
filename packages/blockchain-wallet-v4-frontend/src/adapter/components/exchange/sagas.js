import { Exchange, utils } from 'blockchain-wallet-v4/src'
import { all, call, cancel, fork, select, take, takeEvery, takeLatest, put, race } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { compose, concat, equals, filter, has, head, is, isNil, map, merge, path, prop } from 'ramda'
import BigNumber from 'bignumber.js'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as actions from '../../actions'
import * as actionTypes from '../../actionTypes'
import * as selectors2 from '../../selectors'
import { selectors } from 'data'
import { api } from 'services/ApiService'
import { getPairFromCoin, lessThan, greaterThan } from './services'
import { selectAccounts, selectFee, selectRates, selectShapeshiftPair, selectReceiveAddress, selectChangeAddress } from '../utils/sagas'
import settings from 'config'

let exchangeTask = null

const exchange = function * () {
  try {
    yield call(manageFirstStep)
    yield call(manageSecondStep)
    // yield call(manageThirdStep)
    // yield put(A.thirdStepInitialized())
  } catch (e) {

  }
}

const manageFirstStep = function * () {
  try {
    yield put(A.firstStepInitialized())
    const { btcAccountsInfo, ethAccountsInfo } = yield call(selectAccounts)
    const initialValues = {
      source: head(btcAccountsInfo),
      target: head(ethAccountsInfo)
    }
    yield put(actions.modules.form.initialize('exchange', initialValues))
    // yield put(actions.data.bch.fetchFee())
    yield put(actions.data.btc.fetchFee())
    yield put(actions.data.eth.fetchFee())
    // yield put(actions.data.bch.fetchRates())
    yield put(actions.data.btc.fetchRates())
    yield put(actions.data.eth.fetchRates())
    yield put(actions.data.shapeshift.fetchPair('bch_btc'))
    yield put(actions.data.shapeshift.fetchPair('bch_eth'))
    yield put(actions.data.shapeshift.fetchPair('btc_bch'))
    yield put(actions.data.shapeshift.fetchPair('btc_eth'))
    yield put(actions.data.shapeshift.fetchPair('eth_bch'))
    yield put(actions.data.shapeshift.fetchPair('eth_btc'))
    yield take(AT.EXCHANGE_FIRST_STEP_SUBMIT_CLICKED)
  } catch (e) {
    console.log('e', e)
  }
}

const manageSecondStep = function * () {
  try {
    yield put(A.secondStepInitialized())
    const form = yield select(selectors2.modules.form.getFormValues('exchange'))
    const source = prop('source', form)
    const sourceCoin = prop('coin', source)
    const sourceAmount = prop('sourceAmount', form)
    const target = prop('target', form)
    const targetCoin = prop('coin', target)
    const pair = getPairFromCoin(sourceCoin, targetCoin)
    const returnAddress = yield call(selectReceiveAddress, source)
    const withdrawalAddress = yield call(selectReceiveAddress, target)

    const orderData = yield call(api.createOrder, sourceAmount, pair, returnAddress, withdrawalAddress)
    if (!has('success', orderData)) throw new Error('Shapeshift order could not be placed.')
    const order = prop('success', orderData)
    let fee
    switch (sourceCoin) {
      case 'BTC': fee = yield call(calculateBtcFee, source, sourceAmount, prop('deposit', order)); break
      case 'ETH': fee = yield call(calculateEthFee); break
    }
    yield put(A.secondStepSuccess({ order, fee }))
    yield take(AT.EXCHANGE_SECOND_STEP_SUBMIT_CLICKED)
  } catch (e) {
    yield put(A.secondStepFailure(e.message))
  }
}

const calculateBtcFee = function * (source, amount, depositAddress) {
  const feeR = yield select(selectors2.data.btc.getFee)
  const fee = feeR.getOrElse({})
  const feePerBytePriority = prop('priority', fee)
  const address = prop('address', source) || prop('index', source)
  const wrapper = yield select(selectors.core.wallet.getWrapper)
  const coins = yield call(api.getWalletUnspents, wrapper, address)
  const changeAddress = yield call(selectChangeAddress, source)
  const selection = utils.bitcoin.calculateSelection(amount, coins, feePerBytePriority, depositAddress, changeAddress)
  return utils.bitcoin.calculateFee(selection).fee
}

const calculateEthFee = function * () {
  const feeR = yield select(selectors2.data.eth.getFee)
  const fee = feeR.getOrElse({})
  const gasPrice = prop('priority', fee)
  const gasLimit = prop('gasLimit', fee)
  return utils.ethereum.calculateFee(gasPrice, gasLimit).fee
}

const initialized = function * (action) {
  exchangeTask = yield fork(exchange)
}

const destroyed = function * (action) {
  yield put(actions.modules.form.destroy('exchange'))
  yield cancel(exchangeTask)
}

const swapClicked = function * () {
  try {
    const form = yield select(selectors2.modules.form.getFormValues('exchange'))
    const source = prop('source', form)
    const target = prop('target', form)
    yield put(actions.modules.form.change('exchange', 'source', target))
    yield put(actions.modules.form.change('exchange', 'target', source))
  } catch (e) {
    console.log(e)
  }
}

const minimumClicked = function * () {
  try {
    const form = yield select(selectors2.modules.form.getFormValues('exchange'))
    const source = prop('source', form)
    const sourceCoin = prop('coin', source)
    const target = prop('target', form)
    const targetCoin = prop('coin', target)
    const pair = getPairFromCoin(sourceCoin, targetCoin)
    const { minimum } = yield call(selectShapeshiftPair, pair)
    yield put(actions.modules.form.change('exchange', 'sourceAmount', minimum))
  } catch (e) {
    console.log(e)
  }
}

const maximumClicked = function * () {
  try {
    const form = yield select(selectors2.modules.form.getFormValues('exchange'))
    const source = prop('source', form)
    const sourceCoin = prop('coin', source)
    const target = prop('target', form)
    const targetCoin = prop('coin', target)
    const pair = getPairFromCoin(sourceCoin, targetCoin)
    const { maximum } = yield call(selectShapeshiftPair, pair)
    const effectiveBalance = yield call(calculateEffectiveBalance, source)
    const finalMaximum = lessThan(maximum, effectiveBalance) ? maximum : effectiveBalance
    yield put(actions.modules.form.change('exchange', 'sourceAmount', finalMaximum))
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
    yield call(delay, 500)
    switch (field) {
      case 'source': yield call(changeSource, value); break
      case 'target': yield call(changeTarget, value); break
      case 'sourceAmount': yield call(changeAmount, value, field); break
      case 'sourceFiat': yield call(changeAmount, value, field); break
      case 'targetAmount': yield call(changeAmount, value, field); break
      case 'targetFiat': yield call(changeAmount, value, field); break
    }
  } catch (e) {
    console.log(e)
  }
}

const changeSource = function * (value) {
  const source = value
  const { btcAccountsInfo, ethAccountsInfo } = yield call(selectAccounts)
  const accounts = concat(btcAccountsInfo, ethAccountsInfo)
  const target = compose(head, filter(x => !equals(prop('coin', x), prop('coin', source))))(accounts)
  const formValues = yield select(selectors2.modules.form.getFormValues('exchange'))
  const values = merge(formValues, { source, target })
  yield put(A.firstStepLoading())
  const newValues = yield call(convertValues, values)
  yield put(A.firstStepLoaded())
  yield put(actions.modules.form.initialize('exchange', newValues))
  yield call(validateForm, newValues)
}

const changeTarget = function * (value) {
  const target = value
  const { btcAccountsInfo, ethAccountsInfo } = yield call(selectAccounts)
  const accounts = concat(btcAccountsInfo, ethAccountsInfo)
  const source = compose(head, filter(x => !equals(prop('coin', x), prop('coin', target))))(accounts)
  const formValues = yield select(selectors2.modules.form.getFormValues('exchange'))
  const values = merge(formValues, { source, target })
  yield put(A.firstStepLoading())
  const newValues = yield call(convertValues, values)
  yield put(A.firstStepLoaded())
  yield put(actions.modules.form.initialize('exchange', newValues))
  yield call(validateForm, newValues)
}

const changeAmount = function * (value, type) {
  const formValues = yield select(selectors2.modules.form.getFormValues('exchange'))
  yield put(A.firstStepLoading())
  const newValues = yield call(convertValues, formValues, type)
  yield put(A.firstStepLoaded())
  yield put(actions.modules.form.initialize('exchange', newValues))
  yield call(validateForm, newValues)
}

const validateForm = function * (values) {
  console.log('validateForm', values)
  const source = prop('source', values)
  const sourceCoin = prop('coin', source)
  const target = prop('target', values)
  const targetCoin = prop('coin', target)
  const amount = prop('sourceAmount', values)
  const pair = getPairFromCoin(sourceCoin, targetCoin)
  const effectiveBalance = yield call(calculateEffectiveBalance, source)
  const { minimum, maximum } = yield call(selectShapeshiftPair, pair)
  switch (true) {
    case greaterThan(amount, effectiveBalance): return yield put(A.firstStepError('effective_balance', effectiveBalance))
    case lessThan(amount, minimum): return yield put(A.firstStepError('shapeshift_minimum', minimum))
    case greaterThan(amount, maximum): return yield put(A.firstStepError('shapeshift_maximum', maximum))
  }
  return yield put(A.firstStepError(''))
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
      const sourceAmount = Exchange.convertFiatToCoin(sourceFiat, 'USD', sourceCoin, sourceCoin, sourceRates).value
      const quotation = yield call(api.createQuote, sourceAmount, pair, true)
      const targetAmount = path(['success', 'withdrawalAmount'], quotation) || 0
      const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
      return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
    }
    case 'targetAmount': {
      const targetAmount = prop('targetAmount', values)
      const quotation = yield call(api.createQuote, targetAmount, pair, false)
      const sourceAmount = path(['success', 'depositAmount'], quotation) || 0
      const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
      const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
      return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
    }
    case 'targetFiat': {
      const targetFiat = prop('targetFiat', values)
      const targetAmount = Exchange.convertFiatToCoin(targetFiat, 'USD', targetCoin, targetCoin, targetRates).value
      const quotation = yield call(api.createQuote, targetAmount, pair, false)
      const sourceAmount = path(['success', 'depositAmount'], quotation) || 0
      const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
      return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
    }
    case 'sourceAmount':
    default: {
      const sourceAmount = prop('sourceAmount', values)
      const quotation = yield call(api.createQuote, sourceAmount, pair, true)
      const targetAmount = path(['success', 'withdrawalAmount'], quotation) || 0
      const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
      const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
      return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
    }
  }
}

const calculateEffectiveBalance = function * (source) {
  const sourceCoin = prop('coin', source)
  const fee = yield call(selectFee, sourceCoin)
  switch (sourceCoin) {
    case 'BTC': {
      const feePerBytePriority = prop('priority', fee)
      const address = prop('address', source) || prop('index', source)
      const wrapper = yield select(selectors.core.wallet.getWrapper)
      const coins = yield call(api.getWalletUnspents, wrapper, address)
      return utils.bitcoin.calculateEffectiveBalanceBitcoin(coins, feePerBytePriority)
    }
    case 'ETH': {
      const gasPrice = prop('priority', fee)
      const gasLimit = prop('gasLimit', fee)
      const address = prop('address', source)
      const addresses = yield select(selectors.core.data.ethereum.getAddresses)
      const balance = addresses.map(path([address, 'balance'])).getOrElse(0)
      return utils.ethereum.calculateEffectiveBalanceEther(gasPrice, gasLimit, balance)
    }
  }
}

export default function * () {
  yield takeEvery(AT.EXCHANGE_INITIALIZED, initialized)
  yield takeEvery(AT.EXCHANGE_DESTROYED, destroyed)
  yield takeEvery(AT.EXCHANGE_FIRST_STEP_SWAP_CLICKED, swapClicked)
  yield takeEvery(AT.EXCHANGE_FIRST_STEP_MINIMUM_CLICKED, minimumClicked)
  yield takeEvery(AT.EXCHANGE_FIRST_STEP_MAXIMUM_CLICKED, maximumClicked)
  yield takeEvery(AT.EXCHANGE_SECOND_STEP_CANCEL_CLICKED, destroyed)
  yield takeEvery(AT.EXCHANGE_SECOND_STEP_ORDER_EXPIRED, destroyed)
  yield takeEvery(AT.EXCHANGE_THIRD_STEP_CLOSE_CLICKED, destroyed)
  yield takeLatest(actionTypes.modules.form.CHANGE, change)
}
