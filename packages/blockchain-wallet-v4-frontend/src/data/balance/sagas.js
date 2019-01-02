import { pathOr } from 'ramda'
import { select, put, fork, join, take } from 'redux-saga/effects'
import { Remote } from 'blockchain-wallet-v4/src'

import { actions, actionTypes, selectors } from 'data'

export const logLocation = 'balances'

export const balancePath = ['payload', 'info', 'final_balance']

export const getEthBalance = function*() {
  try {
    const ethBalanceR = yield select(selectors.core.data.ethereum.getBalance)
    if (!Remote.Success.is(ethBalanceR)) {
      const ethData = yield take([
        actionTypes.core.data.ethereum.FETCH_ETHEREUM_DATA_SUCCESS,
        actionTypes.core.data.ethereum.FETCH_ETHEREUM_DATA_FAILURE
      ])
      return pathOr(0, balancePath, ethData)
    }
    return ethBalanceR.getOrElse(0)
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'getEthBalance', e))
  }
}

export const getBtcBalance = function*() {
  try {
    const btcBalanceR = yield select(selectors.core.data.bitcoin.getBalance)
    if (!Remote.Success.is(btcBalanceR)) {
      const btcData = yield take([
        actionTypes.core.data.bitcoin.FETCH_BITCOIN_DATA_SUCCESS,
        actionTypes.core.data.bitcoin.FETCH_BITCOIN_DATA_FAILURE
      ])
      return pathOr(0, balancePath, btcData)
    }
    return btcBalanceR.getOrElse(0)
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'getBtcBalance', e))
  }
}

export const getBchBalance = function*() {
  try {
    const bchBalanceR = yield select(selectors.core.data.bch.getBalance)
    if (!Remote.Success.is(bchBalanceR)) {
      const bchData = yield take([
        actionTypes.core.data.bch.FETCH_BCH_DATA_SUCCESS,
        actionTypes.core.data.bch.FETCH_BCH_DATA_FAILURE
      ])
      return pathOr(0, balancePath, bchData)
    }
    return bchBalanceR.getOrElse(0)
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'getBchBalance', e))
  }
}

export const getBsvBalance = function*() {
  try {
    const bsvBalanceR = yield select(selectors.core.data.bsv.getBalance)
    if (!Remote.Success.is(bsvBalanceR)) {
      const bsvData = yield take([
        actionTypes.core.data.bch.FETCH_BSV_DATA_SUCCESS,
        actionTypes.core.data.bch.FETCH_BSV_DATA_FAILURE
      ])
      return pathOr(0, balancePath, bsvData)
    }
    return bsvBalanceR.getOrElse(0)
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'getBsvBalance', e))
  }
}

export const getXlmBalance = function*() {
  try {
    const xlmBalanceR = yield select(selectors.core.data.xlm.getTotalBalance)
    if (!Remote.Success.is(xlmBalanceR)) {
      const xlmData = yield take(actionTypes.core.data.xlm.FETCH_DATA_SUCCESS)
      return pathOr(0, balancePath, xlmData)
    }
    return xlmBalanceR.getOrElse(0)
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'getXlmBalance', e))
  }
}
export const getAllBalances = function*() {
  const ethT = yield fork(getEthBalance)
  const btcT = yield fork(getBtcBalance)
  const bchT = yield fork(getBchBalance)
  const xlmT = yield fork(getXlmBalance)
  const btc = yield join(btcT)
  const eth = yield join(ethT)
  const bch = yield join(bchT)
  const xlm = yield join(xlmT)

  return { btc, eth, bch, xlm }
}
