import { call, select, put } from 'redux-saga/effects'
import { concat } from 'ramda'
import { selectors } from 'data'

import {
  header,
  sentPending,
  sentConfirmed,
  receivedPending,
  receivedConfirmed
} from './messageTypes'
import * as actions from '../../../actions'
import * as T from 'services/AlertService'

export default ({ api, socket }) => {
  const send = socket.send.bind(socket)

  const onOpen = function * () {
    try {
      // 1. subscribe to block headers
      yield call(
        send,
        JSON.stringify({ command: 'subscribe', entity: 'header', coin: 'btc' })
      )
      yield call(
        send,
        JSON.stringify({ command: 'subscribe', entity: 'header', coin: 'bch' })
      )
      yield call(
        send,
        JSON.stringify({ command: 'subscribe', entity: 'header', coin: 'eth' })
      )

      // 2. subscribe to accounts

      /* wallet */
      let walletContext = yield select(
        selectors.core.wallet.getInitialSocketContext
      )
      walletContext.addresses.forEach(address => {
        send(
          JSON.stringify({
            command: 'subscribe',
            entity: 'account',
            coin: 'btc',
            param: { address }
          })
        )
        send(
          JSON.stringify({
            command: 'subscribe',
            entity: 'account',
            coin: 'bch',
            param: { address }
          })
        )
      })
      walletContext.xpubs.forEach(xpub => {
        send(
          JSON.stringify({
            command: 'subscribe',
            entity: 'xpub',
            coin: 'btc',
            param: { address: xpub }
          })
        )
        send(
          JSON.stringify({
            command: 'subscribe',
            entity: 'xpub',
            coin: 'bch',
            param: { address: xpub }
          })
        )
      })

      /* lockbox */
      const { data: btcLockboxContext } = yield select(
        selectors.core.kvStore.lockbox.getLockboxBtcContext
      )
      btcLockboxContext.forEach(xpub =>
        send(
          JSON.stringify({
            command: 'subscribe',
            entity: 'xpub',
            coin: 'btc',
            param: { address: xpub }
          })
        )
      )
      const { data: bchLockboxContext } = yield select(
        selectors.core.kvStore.lockbox.getLockboxBchContext
      )
      bchLockboxContext.forEach(xpub =>
        send(
          JSON.stringify({
            command: 'subscribe',
            entity: 'xpub',
            coin: 'bch',
            param: { address: xpub }
          })
        )
      )

      /* eth */
      const ethWalletContext = yield select(selectors.core.data.eth.getContext)
      const { data: ethLockboxContext } = yield select(
        selectors.core.kvStore.lockbox.getLockboxEthContext
      )
      const ethAddresses = concat(ethWalletContext, ethLockboxContext)
      ethAddresses.forEach(address => {
        send(
          JSON.stringify({
            command: 'subscribe',
            entity: 'account',
            coin: 'eth',
            param: { address }
          })
        )
      })
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          'middleware/webSocket/socketd/sagas',
          'onOpen',
          e.message
        )
      )
    }
  }

  const onMessage = function * (action) {
    const message = action.payload

    try {
      switch (message.coin) {
        case 'btc':
          if (header(message)) {
            const { header } = message
            yield put(
              actions.core.data.btc.setBtcLatestBlock(
                header.blockIndex,
                header.hash,
                header.height,
                header.time
              )
            )
          } else if (sentPending(message)) {
            // TODO: handle pending
          } else if (sentConfirmed(message)) {
            yield put(
              actions.alerts.displaySuccess(
                'Your Bitcoin transaction is now confirmed!'
              )
            )
          } else if (receivedPending(message)) {
            yield put(
              actions.alerts.displayInfo('A Bitcoin payment is pending.')
            )
          } else if (receivedConfirmed(message)) {
            yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_BTC))
          }
          break

        case 'bch':
          if (header(message)) {
            const { header } = message
            yield put(
              actions.core.data.bch.setBCHLatestBlock(
                header.blockIndex,
                header.hash,
                header.height,
                header.time
              )
            )
          } else if (sentPending(message)) {
            // TODO: handle pending
          } else if (sentConfirmed(message)) {
            yield put(
              actions.alerts.displaySuccess(
                'Your Bitcoin cash transaction is now confirmed!'
              )
            )
          } else if (receivedPending(message)) {
            yield put(
              actions.alerts.displayInfo('A Bitcoin cash payment is pending.')
            )
          } else if (receivedConfirmed(message)) {
            yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_BCH))
          }
          break

        case 'eth':
          if (header(message)) {
            yield put(
              actions.core.data.eth.fetchLatestBlockSuccess(message.header)
            )
          } else if (sentPending(message)) {
            // TODO: handle pending
            // yield put(actions.alerts.displayInfo('Your Ethereum transaction is now pending!'))
          } else if (sentConfirmed(message)) {
            yield put(
              actions.alerts.displaySuccess(
                'Your Ethereum transaction is now confirmed!'
              )
            )
          } else if (receivedPending(message)) {
            yield put(
              actions.alerts.displayInfo('An Ethereum payment is pending.')
            )
          } else if (receivedConfirmed(message)) {
            yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_ETH))
          }
          break

        default:
          break
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          'middleware/webSocket/socketd/sagas',
          'onMessage',
          'unknown type for',
          e.message
        )
      )
    }
  }

  const onClose = function * (action) {}

  return {
    onOpen,
    onMessage,
    onClose
  }
}
