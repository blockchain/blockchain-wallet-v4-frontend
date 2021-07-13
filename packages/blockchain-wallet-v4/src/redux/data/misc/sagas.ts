import BigNumber from 'bignumber.js'
import moment from 'moment'
import { call, put, select } from 'redux-saga/effects'

import { FiatTypeEnum, PriceDiffType, TimeRange } from 'blockchain-wallet-v4/src/types'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { APIType } from 'core/network/api'

import * as pairing from '../../../pairing'
import * as wS from '../../wallet/selectors'
import * as A from './actions'
import { start } from './model'

const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }: { api: APIType }) => {
  const getPercentChange = (newNum: number, oldNum: number): PriceDiffType => {
    const current = new BigNumber(newNum)
    const previous = new BigNumber(oldNum)
    const diff = current.minus(previous)
    const diffPercent = diff.isZero()
      ? new BigNumber(0)
      : new BigNumber(diff.dividedBy(previous)).times(100)

    return {
      diff: diff.toFixed(2),
      movement: diffPercent.isEqualTo(0) ? 'none' : diffPercent.isGreaterThan(0) ? 'up' : 'down',
      percentChange: diffPercent.abs().toFixed(2)
    }
  }

  const fetchPriceChange = function* (action: ReturnType<typeof A.fetchPriceChange>) {
    const { base, positionAmt = 0, quote, range } = action.payload
    try {
      if (base in FiatTypeEnum) return
      yield put(A.fetchPriceChangeLoading(base, range))

      const time = range === TimeRange.ALL ? moment.unix(start[base]) : moment().subtract(1, range)

      const previous: ReturnType<typeof api.getPriceIndex> = yield call(
        api.getPriceIndex,
        base,
        quote,
        time
      )
      const current: ReturnType<typeof api.getPriceIndex> = yield call(
        api.getPriceIndex,
        base,
        quote,
        moment()
      )

      // Overall coin price movement
      const overallChange = getPercentChange(current.price, previous.price)
      // User's position, if given an amount will provide the
      // change for that amount or else will fallback to 0
      const currentPosition = new BigNumber(positionAmt).times(current.price).toNumber()
      const previousPosition = new BigNumber(positionAmt).times(previous.price).toNumber()
      const positionChange = getPercentChange(currentPosition, previousPosition)

      yield put(
        A.fetchPriceChangeSuccess(
          base,
          previous.price,
          current.price,
          range,
          overallChange,
          positionChange
        )
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchPriceChangeFailure(base, error, range))
    }
  }

  const fetchPriceIndexSeries = function* (action) {
    try {
      const { coin, currency, scale, start } = action.payload
      yield put(A.fetchPriceIndexSeriesLoading())
      const data = yield call(api.getPriceIndexSeries, coin, currency, start, scale)
      yield put(A.fetchPriceIndexSeriesSuccess(data))
    } catch (e) {
      yield put(A.fetchPriceIndexSeriesFailure(e.message))
    }
  }

  const encodePairingCode = function* () {
    try {
      yield put(A.encodePairingCodeLoading())
      const guid = yield select(wS.getGuid)
      const sharedKey = yield select(wS.getSharedKey)
      const password = yield select(wS.getMainPassword)
      const pairingPassword = yield call(api.getPairingPassword, guid)
      const encryptionPhrase = yield call(() =>
        taskToPromise(pairing.encode(guid, sharedKey, password, pairingPassword))
      )
      yield put(A.encodePairingCodeSuccess(encryptionPhrase))
    } catch (e) {
      yield put(A.encodePairingCodeFailure(e.message || e))
    }
  }

  const authorizeLogin = function* (action) {
    const { confirm, token } = action.payload
    try {
      yield put(A.authorizeLoginLoading())
      const data = yield call(api.authorizeLogin, token, confirm)
      if (data.success || data.device_change_reason) {
        yield put(A.authorizeLoginSuccess(data))
      } else {
        yield put(A.authorizeLoginFailure(data.error))
      }
    } catch (e) {
      yield put(A.authorizeLoginFailure(e.message || e.error))
    }
  }

  const sendSecureChannelMessage = function* (action) {
    try {
      // yield put(A.authorizeLoginLoading())
      // const data =
      yield call(api.sendSecureChannel, JSON.stringify(action.payload))
      // if (data.success || data.device_change_reason) {
      //   yield put(A.authorizeLoginSuccess(data))
      // } else {
      //   yield put(A.authorizeLoginFailure(data.error))
      // }
    } catch (e) {
      // TODO Should this be a new loading state or can I import the other one?
      // yield put(A.authorizeLoginFailure(e.message || e.error))
    }
  }

  const handle2FAReset = function* (action) {
    const { token } = action.payload
    try {
      yield put(A.handle2FAResetLoading())
      const data = yield call(api.handle2faReset, token)
      if (data.success) {
        yield put(A.handle2FAResetSuccess(data))
      } else {
        yield put(A.handle2FAResetFailure(data.error))
      }
    } catch (e) {
      yield put(A.handle2FAResetFailure(e.message || e.error))
    }
  }

  const verifyEmailToken = function* (action) {
    const { token } = action.payload
    try {
      yield put(A.verifyEmailTokenLoading())
      const data = yield call(api.verifyEmailToken, token)
      if (data.success) {
        yield put(A.verifyEmailTokenSuccess(data))
      } else {
        yield put(A.verifyEmailTokenFailure(data.error))
      }
    } catch (e) {
      yield put(A.handle2FAResetFailure(e.message || e.error))
    }
  }

  return {
    authorizeLogin,
    encodePairingCode,
    fetchPriceChange,
    fetchPriceIndexSeries,
    handle2FAReset,
    sendSecureChannelMessage,
    verifyEmailToken
  }
}
