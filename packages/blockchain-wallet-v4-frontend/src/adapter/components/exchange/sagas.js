import { Exchange } from 'blockchain-wallet-v4/src'
import { call, select, takeEvery, takeLatest, put } from 'redux-saga/effects'
import { compose, concat, equals, has, head, map, merge, path, prop } from 'ramda'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as actions from '../../actions'
import * as actionTypes from '../../actionTypes'
import * as selectors2 from '../../selectors'
import { selectors } from 'data'
import { getPairFromCoin } from './services'
import { api } from 'services/ApiService'

const initialized = function * (action) {
  try {
    const btcHDAccountsInfo = yield select(selectors.core.common.bitcoin.getAccountsInfo)
    const btcAddressesInfo = yield select(selectors.core.common.bitcoin.getAddressesInfo)
    const btcAccountsInfo = concat(btcHDAccountsInfo, btcAddressesInfo)
    const ethAccountsInfoR = yield select(selectors.core.common.ethereum.getAccountsInfo)
    const ethAccountsInfo = ethAccountsInfoR.getOrElse([])
    const btcDefaultAccount = head(btcAccountsInfo)
    const ethDefaultAccount = head(ethAccountsInfo)
    const initialValues = {
      source: btcDefaultAccount,
      target: ethDefaultAccount
    }
    // Initialize form
    yield put(actions.modules.form.initialize('exchange', initialValues))
    // Fetch rates
    // yield put(actions.data.bch.fetchRates) 
    // yield put(actions.data.btc.fetchRates)
    // yield put(actions.data.eth.fetchRates)

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
  const payload = action.payload

  switch (field) {
    case 'source': yield call(changeSource, payload); break
    case 'target': yield call(changeTarget, payload); break
    case 'sourceAmount': yield call(changeSourceAmount, payload); break
    case 'targetAmount': yield call(changeTargetAmount, payload); break
    case 'sourceFiat': yield call(changeSourceFiat, payload); break
    case 'targetFiat': yield call(changeTargetFiat, payload); break
  }
}

const changeSource = function * (payload) {
  const source = payload
  const form = yield select(selectors2.modules.form.getFormValues('exchange'))
  const targetCoin = path(['target', 'coin'], form)
  const sourceCoin = prop('coin', source)
  // const target = equals(sourceCoin, targetCoin)) =>

  // switch (sourceCoin) {
  //   case 'BCH': yield put(actions.data.bch.fetchUnspents, payload.address || payload.index)
  //   case 'BTC': yield put(actions.data.bt.fetchUnspents, payload.address || payload.index)
  // }

}
const changeTarget = function * (payload) {
  const form = yield select(selectors2.modules.form.getFormValues('exchange'))
  const sourceCoin = path(['source', 'coin'], form)
  const targetCoin = path(['target', 'coin'], form)

}

const changeSourceAmount = function * (payload) {
  const form = yield select(selectors2.modules.form.getFormValues('exchange'))
  const sourceCoin = path(['source', 'coin'], form)
  const targetCoin = path(['target', 'coin'], form)
  const sourceAmount = payload
  const pair = getPairFromCoin(sourceCoin, targetCoin)
  const quotation = yield call(api.createQuote, sourceAmount, pair, true)
  if (!has('success', quotation)) return
  const targetAmount = path(['success', 'withdrawalAmount'], quotation)
  const sourceRates = yield call(selectRates, sourceCoin)
  const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
  const targetRates = yield call(selectRates, targetCoin)
  const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
  yield call(updateForm, { sourceAmount, sourceFiat, targetAmount, targetFiat })
}

const changeSourceFiat = function * (payload) {
  const form = yield select(selectors2.modules.form.getFormValues('exchange'))
  const sourceCoin = path(['source', 'coin'], form)
  const targetCoin = path(['target', 'coin'], form)
  const sourceFiat = payload
  const sourceRates = yield call(selectRates, sourceCoin)
  const sourceAmount = Exchange.convertFiatToCoin(sourceFiat, 'USD', sourceCoin, sourceCoin, sourceRates).value
  const pair = getPairFromCoin(sourceCoin, targetCoin)
  const quotation = yield call(api.createQuote, sourceAmount, pair, true)
  if (!has('success', quotation)) return
  const targetAmount = path(['success', 'withdrawalAmount'], quotation)
  const targetRates = yield call(selectRates, targetCoin)
  const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
  yield call(updateForm, { sourceAmount, sourceFiat, targetAmount, targetFiat })
}

const changeTargetAmount = function * (payload) {
  const form = yield select(selectors2.modules.form.getFormValues('exchange'))
  const sourceCoin = path(['source', 'coin'], form)
  const targetCoin = path(['target', 'coin'], form)
  const targetAmount = payload
  const pair = getPairFromCoin(sourceCoin, targetCoin)
  const quotation = yield call(api.createQuote, targetAmount, pair, false)
  if (!has('success', quotation)) return
  const sourceAmount = path(['success', 'depositAmount'], quotation)
  const sourceRates = yield call(selectRates, sourceCoin)
  const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
  const targetRates = yield call(selectRates, targetCoin)
  const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
  yield call(updateForm, { sourceAmount, sourceFiat, targetAmount, targetFiat })
}

const changeTargetFiat = function * (payload) {
  const form = yield select(selectors2.modules.form.getFormValues('exchange'))
  const sourceCoin = path(['source', 'coin'], form)
  const targetCoin = path(['target', 'coin'], form)
  const targetFiat = payload
  const targetRates = yield call(selectRates, targetCoin)
  const targetAmount = Exchange.convertFiatToCoin(targetFiat, 'USD', targetCoin, targetCoin, targetRates).value
  const pair = getPairFromCoin(sourceCoin, targetCoin)
  const quotation = yield call(api.createQuote, targetAmount, pair, false)
  if (!has('success', quotation)) return
  const sourceAmount = path(['success', 'depositAmount'], quotation)
  const sourceRates = yield call(selectRates, sourceCoin)
  const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
  yield call(updateForm, { sourceAmount, sourceFiat, targetAmount, targetFiat })
}

const updateForm = function * (values) {
  const currentValues = yield select(selectors2.modules.form.getFormValues('exchange'))
  yield put(actions.modules.form.initialize('exchange', merge(currentValues, values)))
}

const selectRates = function * (coin) {
  const bchRatesR = yield select(selectors2.data.bch.getRates)
  const btcRatesR = yield select(selectors2.data.btc.getRates)
  const ethRatesR = yield select(selectors2.data.eth.getRates)

  switch (coin) {
    case 'BCH': return bchRatesR.getOrElse({})
    case 'BTC': return btcRatesR.getOrElse({})
    case 'ETH': return ethRatesR.getOrElse({})
  }
}

export default function * () {
  yield takeEvery(AT.EXCHANGE_INITIALIZED, initialized)
  yield takeEvery(AT.EXCHANGE_SWAP_CLICKED, swapClicked)
  yield takeEvery(actionTypes.modules.form.CHANGE, change)
}
