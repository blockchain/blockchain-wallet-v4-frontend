import { pathOr } from 'ramda'
import { fork, join, put, select, take } from 'redux-saga/effects'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, actionTypes, selectors } from 'data'

export const logLocation = 'balances'
export const balancePath = ['payload', 'info', 'final_balance']

export const getEthBalance = function * () {
  try {
    const ethBalanceR = yield select(selectors.core.data.eth.getBalance)
    if (!Remote.Success.is(ethBalanceR)) {
      const ethData = yield take([
        actionTypes.core.data.eth.FETCH_ETH_DATA_SUCCESS,
        actionTypes.core.data.eth.FETCH_ETH_DATA_FAILURE
      ])
      return pathOr(0, balancePath, ethData)
    }
    return ethBalanceR.getOrElse(0)
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'getEthBalance', e))
  }
}

export const getErc20Balance = function * (token) {
  try {
    const erc20BalanceR = yield select(
      selectors.core.data.eth.getErc20Balance,
      token
    )
    if (!Remote.Success.is(erc20BalanceR)) {
      yield put(actions.core.data.eth.fetchErc20Data(token))
      const erc20Data = yield take([
        action =>
          action.type ===
            actionTypes.core.data.eth.FETCH_ERC20_TOKEN_DATA_SUCCESS &&
          action.payload.token === token,
        action =>
          action.type ===
            actionTypes.core.data.eth.FETCH_ERC20_TOKEN_DATA_FAILURE &&
          action.payload.token === token
      ])
      return pathOr(0, balancePath, erc20Data)
    }
    return erc20BalanceR.getOrElse(0)
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'getErc20Balance', e))
  }
}

export const getBtcBalance = function * () {
  try {
    const btcBalanceR = yield select(selectors.core.data.btc.getBalance)
    if (!Remote.Success.is(btcBalanceR)) {
      const btcData = yield take([
        actionTypes.core.data.btc.FETCH_BTC_DATA_SUCCESS,
        actionTypes.core.data.btc.FETCH_BTC_DATA_FAILURE
      ])
      return pathOr(0, balancePath, btcData)
    }
    return btcBalanceR.getOrElse(0)
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'getBtcBalance', e))
  }
}

export const getBchBalance = function * () {
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

export const getXlmBalance = function * () {
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

export const waitForAllBalances = function * () {
  const btcT = yield fork(getBtcBalance)
  const bchT = yield fork(getBchBalance)
  const ethT = yield fork(getEthBalance)
  const xlmT = yield fork(getXlmBalance)
  const btc = yield join(btcT)
  const bch = yield join(bchT)
  const eth = yield join(ethT)
  const xlm = yield join(xlmT)

  return { btc, eth, bch, xlm }
}
