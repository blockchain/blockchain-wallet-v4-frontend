import { call, put, select } from 'redux-saga/effects'

import { sha256 } from '@core/walletCrypto'
import { actions, selectors } from 'data'

export default ({ socket }) => {
  const authenticateSocket = function* () {
    const guid = yield select(selectors.core.wallet.getGuid)
    const sharedKey = yield select(selectors.core.wallet.getSharedKey)

    const guidHash = sha256(guid).toString('hex')
    const sharedKeyHash = sha256(sharedKey).toString('hex')

    const authParams = {
      action: 'subscribe',
      auth: {
        guidHash,
        sharedKeyHash
      },
      channel: 'activity',
      params: {
        acceptLanguage: 'en-GB;q=1.0, en',
        fiatCurrency: 'GBP',
        timezoneIana: 'Europe/London'
      }
    }

    socket.send(JSON.stringify(authParams))
  }

  const onOpen = function* () {
    yield call(authenticateSocket)
  }

  const onAuth = function* () {}

  const onMessage = function* (action) {
    yield put(
      actions.core.data.coins.fetchUnifiedBalancesWebService({
        coin: 'MATIC.MATIC',
        transactions: action.payload.data.activity.filter((tx) => {
          return tx.item.leading[0].value.includes('MATIC')
        })
      })
    )
    yield put(
      actions.core.data.coins.fetchUnifiedBalancesWebService({
        coin: 'USDC.MATIC',
        transactions: action.payload.data.activity.filter((tx) => {
          return tx.item.leading[0].value.includes('USDC')
        })
      })
    )
    yield put(
      actions.core.data.coins.fetchUnifiedBalancesWebService({
        coin: 'USDT.MATIC',
        transactions: action.payload.data.activity.filter((tx) => {
          return tx.item.leading[0].value.includes('USDT')
        })
      })
    )
  }

  const onClose = function* () {
    yield put(
      actions.logs.logErrorMessage(
        'middleware/webSocket/activities/sagas',
        'onClose',
        `websocket closed at ${Date.now()}`
      )
    )
  }

  return {
    onAuth,
    onClose,
    onMessage,
    onOpen
  }
}
