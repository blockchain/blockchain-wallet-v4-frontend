import { prop } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { sha256 } from '@core/walletCrypto'
import { actions, selectors } from 'data'

export default ({ api, socket }) => {
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

  const onMessage = function* (action) {}

  const resendMessageSocket = function* (action) {}

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
    onOpen,
    resendMessageSocket
  }
}
