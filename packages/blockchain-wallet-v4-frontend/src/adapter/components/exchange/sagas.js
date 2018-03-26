import { Exchange, utils } from 'blockchain-wallet-v4/src'
import { call, select, takeEvery, takeLatest, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { compose, concat, equals, filter, has, head, map, merge, path, prop } from 'ramda'
import BigNumber from 'bignumber.js'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as actions from '../../actions'
import * as actionTypes from '../../actionTypes'
import * as selectors2 from '../../selectors'
import { selectors } from 'data'
import { api } from 'services/ApiService'
import { getPairFromCoin, lessThan, lessThanOrEqualTo, greaterThan, greaterThanOrEqualTo } from './services'

const initialized = function * (action) {
  try {
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
    yield put(actions.data.shapeshift.fetchShapeshiftPair('bch_btc'))
    yield put(actions.data.shapeshift.fetchShapeshiftPair('bch_eth'))
    yield put(actions.data.shapeshift.fetchShapeshiftPair('btc_bch'))
    yield put(actions.data.shapeshift.fetchShapeshiftPair('btc_eth'))
    yield put(actions.data.shapeshift.fetchShapeshiftPair('eth_bch'))
    yield put(actions.data.shapeshift.fetchShapeshiftPair('eth_btc'))
  } catch (e) {
    console.log(e)
    // yield put(actions.alerts.displayError('Price index series chart could not be initialized.'))
  }
}

const swapClicked = function * () {
  const form = yield select(selectors2.modules.form.getFormValues('exchange'))
  const source = prop('source', form)
  const target = prop('target', form)
  yield call(updateForm, { source: target, target: source })
}

const change = function * (action) {
  const form = prop('form', action.meta)
  const field = prop('field', action.meta)
  if (!equals('exchange', form)) return
  yield call(delay, 500)
  switch (field) {
    case 'source': yield call(changeSource, action.payload); break
    case 'target': yield call(changeTarget, action.payload); break
    case 'sourceAmount': yield call(changeSourceAmount, action.payload); break
    case 'targetAmount': yield call(changeTargetAmount, action.payload); break
    case 'sourceFiat': yield call(changeSourceFiat, action.payload); break
    case 'targetFiat': yield call(changeTargetFiat, action.payload); break
  }
}

const changeSource = function * (payload) {
  try {
    const source = payload
    const { btcAccountsInfo, ethAccountsInfo } = yield call(selectAccounts)
    const accounts = concat(btcAccountsInfo, ethAccountsInfo)
    const target = compose(head, filter(x => !equals(prop('coin', x), prop('coin', source))))(accounts)
    yield call(updateForm, { source, target })
  } catch (e) {
    console.log(e)
  }
}

const changeTarget = function * (payload) {
  try {
    const target = payload
    const { btcAccountsInfo, ethAccountsInfo } = yield call(selectAccounts)
    const accounts = concat(btcAccountsInfo, ethAccountsInfo)
    const source = compose(head, filter(x => !equals(prop('coin', x), prop('coin', target))))(accounts)
    yield call(updateForm, { source, target })
  } catch (e) {
    console.log(e)
  }
}

const changeSourceAmount = function * (payload) {
  try {
    const form = yield select(selectors2.modules.form.getFormValues('exchange'))
    const sourceCoin = path(['source', 'coin'], form)
    const targetCoin = path(['target', 'coin'], form)
    const sourceAmount = payload
    const pair = getPairFromCoin(sourceCoin, targetCoin)
    yield put(actions.components.exchange.statusLoading())
    const quotation = yield call(api.createQuote, sourceAmount, pair, true)
    yield put(actions.components.exchange.statusLoaded())
    const targetAmount = path(['success', 'withdrawalAmount'], quotation) || 0
    const sourceRates = yield call(selectRates, sourceCoin)
    const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
    const targetRates = yield call(selectRates, targetCoin)
    const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
    yield call(updateForm, { sourceAmount, sourceFiat, targetAmount, targetFiat })
  } catch (e) {
    console.log(e)
  }
}

const changeSourceFiat = function * (payload) {
  try {
    const form = yield select(selectors2.modules.form.getFormValues('exchange'))
    const sourceCoin = path(['source', 'coin'], form)
    const targetCoin = path(['target', 'coin'], form)
    const sourceFiat = payload
    const sourceRates = yield call(selectRates, sourceCoin)
    const sourceAmount = Exchange.convertFiatToCoin(sourceFiat, 'USD', sourceCoin, sourceCoin, sourceRates).value
    const pair = getPairFromCoin(sourceCoin, targetCoin)
    yield put(actions.components.exchange.statusLoading())
    const quotation = yield call(api.createQuote, sourceAmount, pair, true)
    yield put(actions.components.exchange.statusLoaded())
    const targetAmount = path(['success', 'withdrawalAmount'], quotation) || 0
    const targetRates = yield call(selectRates, targetCoin)
    const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
    yield call(updateForm, { sourceAmount, sourceFiat, targetAmount, targetFiat })
  } catch (e) {
    console.log(e)
  }
}

const changeTargetAmount = function * (payload) {
  try {
    const form = yield select(selectors2.modules.form.getFormValues('exchange'))
    const sourceCoin = path(['source', 'coin'], form)
    const targetCoin = path(['target', 'coin'], form)
    const targetAmount = payload
    const pair = getPairFromCoin(sourceCoin, targetCoin)
    yield put(actions.components.exchange.statusLoading())
    const quotation = yield call(api.createQuote, targetAmount, pair, false)
    yield put(actions.components.exchange.statusLoaded())
    const sourceAmount = path(['success', 'depositAmount'], quotation) || 0
    const sourceRates = yield call(selectRates, sourceCoin)
    const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
    const targetRates = yield call(selectRates, targetCoin)
    const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
    yield call(updateForm, { sourceAmount, sourceFiat, targetAmount, targetFiat })
  } catch (e) {
    console.log(e)
  }
}

const changeTargetFiat = function * (payload) {
  try {
    const form = yield select(selectors2.modules.form.getFormValues('exchange'))
    const sourceCoin = path(['source', 'coin'], form)
    const targetCoin = path(['target', 'coin'], form)
    const targetFiat = payload
    const targetRates = yield call(selectRates, targetCoin)
    const targetAmount = Exchange.convertFiatToCoin(targetFiat, 'USD', targetCoin, targetCoin, targetRates).value
    const pair = getPairFromCoin(sourceCoin, targetCoin)
    yield put(actions.components.exchange.statusLoading())
    const quotation = yield call(api.createQuote, targetAmount, pair, false)
    yield put(actions.components.exchange.statusLoaded())
    const sourceAmount = path(['success', 'depositAmount'], quotation) || 0
    const sourceRates = yield call(selectRates, sourceCoin)
    const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
    yield call(updateForm, { sourceAmount, sourceFiat, targetAmount, targetFiat })
  } catch (e) {
    console.log(e)
  }
}

const updateForm = function * (values) {
  const form = yield select(selectors2.modules.form.getFormValues('exchange'))
  const sourceCoin = path(['source', 'coin'], form)
  const currentValues = yield select(selectors2.modules.form.getFormValues('exchange'))
  const newValues = merge(currentValues, values)
  yield put(actions.modules.form.initialize('exchange', newValues))
  yield call(validateForm, newValues)
}

const validateForm = function * (values) {
  switch (path(['source', 'coin'], values)) {
    case 'BTC': yield call(validateBtc, values); break
    case 'ETH': yield call(validateEth, values); break
  }
}

const validateBtc = function * (values) {
  const source = prop('source', values)
  const address = prop('address', source) || prop('index', source)
  const sourceAmount = prop('sourceAmount', values)
  const feePerBytePriority = yield call(selectFee, prop('coin', source))
  const wrapper = yield select(selectors.core.wallet.getWrapper)
  const data = yield call(api.getWalletUnspents, wrapper, address)
  const effectiveBalance = utils.bitcoin.calculateEffectiveBalanceBitcoin(data, feePerBytePriority)
  if (greaterThan(sourceAmount, effectiveBalance)) {
    return yield put(actions.components.exchange.error('effective_balance', effectiveBalance))
  }
  yield call(validateShapeshift, values)
}

const validateEth = function * (values) {

}

const validateShapeshift = function * (values) {
  const source = prop('source', values)
  const sourceAmount = prop('sourceAmount', values)
  const target = prop('target', values)
  const pair = getPairFromCoin(prop('coin', source), prop('coin', target))
  const { minimum, maximum } = yield call(selectShapeshiftPair, pair)
  if (lessThan(sourceAmount, minimum)) {
    return yield put(actions.components.exchange.error('shapeshift_minimum', minimum))
  }
  if (greaterThan(sourceAmount, maximum)) {
    return yield put(actions.components.exchange.error('shapeshift_maximum', maximum))
  }
  return yield put(actions.components.exchange.error(''))
}

const selectAccounts = function* () {
  const btcHDAccountsInfo = yield select(selectors.core.common.bitcoin.getAccountsInfo)
  const btcAddressesInfo = yield select(selectors.core.common.bitcoin.getAddressesInfo)
  const btcAccountsInfo = concat(btcHDAccountsInfo, btcAddressesInfo)
  const ethAccountsInfoR = yield select(selectors.core.common.ethereum.getAccountsInfo)
  const ethAccountsInfo = ethAccountsInfoR.getOrElse([])
  return {
    btcAccountsInfo,
    ethAccountsInfo
  }
}

const selectFee = function * (coin) {
  // const bchRatesR = yield select(selectors2.data.bch.getFee)
  const btcRatesR = yield select(selectors2.data.btc.getFee)
  const ethRatesR = yield select(selectors2.data.eth.getFee)
  switch (coin) {
    // case 'BCH': return prop('priority', bchRatesR.getOrElse({ regular: 2, priority: 10 }))
    case 'BTC': return prop('priority', btcRatesR.getOrElse({ regular: 10, priority: 25 }))
    case 'ETH': return prop('priority', ethRatesR.getOrElse({ regular: 21, priority: 21 }))
  }
}

const selectRates = function * (coin) {
  // const bchRatesR = yield select(selectors2.data.bch.getRates)
  const btcRatesR = yield select(selectors2.data.btc.getRates)
  const ethRatesR = yield select(selectors2.data.eth.getRates)
  switch (coin) {
    // case 'BCH': return bchRatesR.getOrElse({})
    case 'BTC': return btcRatesR.getOrElse({})
    case 'ETH': return ethRatesR.getOrElse({})
  }
}

const selectShapeshiftPair = function * (pair) {
  const shapeshiftPairR = yield select(selectors2.data.shapeshift.getPair(pair))
  const shapeshiftPair = shapeshiftPairR.getOrElse({})
  return {
    minimum: prop('minimum', shapeshiftPair),
    maximum: prop('limit', shapeshiftPair)
  }
}

export default function * () {
  yield takeEvery(AT.EXCHANGE_INITIALIZED, initialized)
  yield takeEvery(AT.EXCHANGE_SWAP_CLICKED, swapClicked)
  yield takeLatest(actionTypes.modules.form.CHANGE, change)
}
