import { call, select, put } from 'redux-saga/effects'
import { concat, equals, prop } from 'ramda'
import { selectors } from 'data'
import * as actions from '../../../actions'
import * as T from 'services/AlertService'
import { WALLET_TX_SEARCH } from '../../../form/model'
import {
  header,
  ethSentConfirmed,
  ethReceivedPending,
  ethReceivedConfirmed,
  btcTransaction
} from './messageTypes'

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

      /* wallet */
      let walletContext = yield select(
        selectors.core.wallet.getInitialSocketContext
      )

      // 2. subscribe to accounts
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

      // 3. subscribe to xpubs
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

      // 4. subscribe to lockbox xpubs
      const btcLockboxContext = (yield select(
        selectors.core.kvStore.lockbox.getLockboxBtcContext
      )).getOrElse([])

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
      const bchLockboxContext = (yield select(
        selectors.core.kvStore.lockbox.getLockboxBchContext
      )).getOrElse([])

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

      // 5. subscribe to ethereum addresses
      const ethWalletContext = yield select(selectors.core.data.eth.getContext)
      const ethLockboxContext = (yield select(
        selectors.core.kvStore.lockbox.getLockboxEthContext
      )).getOrElse([])

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
          'middleware/webSocket/coins/sagas',
          'onOpen',
          e.message
        )
      )
    }
  }

  const onMessage = function * (action) {
    const message = prop('payload', action)

    try {
      switch (message.coin) {
        case 'btc':
          if (header(message)) {
            const header = prop('header', message)
            yield put(
              actions.core.data.btc.setBtcLatestBlock(
                header.blockIndex,
                header.hash,
                header.height,
                header.time
              )
            )
          } else if (btcTransaction(message)) {
            // check of sent or received
            const direction = yield sentOrReceived('btc', message)
            if (direction === 'received') {
              yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_BTC))
            }

            // refresh data
            yield put(actions.core.data.btc.fetchData())

            // if on transactions page, update
            yield transactionsUpdate('btc')
          }
          break

        case 'bch':
          if (header(message)) {
            const header = prop('header', message)
            yield put(
              actions.core.data.bch.setBCHLatestBlock(
                header.blockIndex,
                header.hash,
                header.height,
                header.time
              )
            )
          } else if (btcTransaction(message)) {
            // check of sent or received
            const direction = yield sentOrReceived('bch', message)
            if (direction === 'received') {
              yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_BCH))
            }

            // refresh data
            yield put(actions.core.data.bch.fetchData())

            // if on transactions page, update
            yield transactionsUpdate('bch')
          }
          break

        case 'eth':
          if (header(message)) {
            const header = prop('header', message)
            yield put(actions.core.data.eth.fetchLatestBlockSuccess(header))
          } else if (ethSentConfirmed(message)) {
            yield put(
              actions.alerts.displaySuccess(
                'Your Ether transaction has been confirmed!'
              )
            )
            yield put(actions.core.data.eth.fetchTransactions(null, true))
            yield put(actions.core.data.eth.fetchData([message.address]))
          } else if (ethReceivedPending(message)) {
            yield put(
              actions.alerts.displayInfo(
                "You've just received a pending Ether payment."
              )
            )
          } else if (ethReceivedConfirmed(message)) {
            yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_ETH))
            yield put(actions.core.data.eth.fetchTransactions(null, true))
            yield put(actions.core.data.eth.fetchData([message.address]))
          }
          break

        default:
          break
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          'middleware/webSocket/coins/sagas',
          'onMessage',
          'unknown type for',
          e.message
        )
      )
    }
  }

  const sentOrReceived = function * (coin, message) {
    if (coin !== 'btc' && coin !== 'bch') throw new Error('not a valid coin')

    const context = yield select(selectors.core.data[coin].getContext)
    const endpoint = coin === 'btc' ? 'fetchBlockchainData' : 'fetchBchData'
    const data = yield call(api[endpoint], context, {
      n: 50,
      offset: 0
    })
    const transactions = data.txs || []

    for (let i in transactions) {
      const transaction = transactions[i]
      if (equals(transaction.hash, message.transaction.hash)) {
        if (transaction.result > 0) return 'received'
        break
      }
    }
    return 'sent'
  }

  const transactionsUpdate = function * (coin) {
    if (coin !== 'btc' && coin !== 'bch') throw new Error('not a valid coin')

    const pathname = yield select(selectors.router.getPathname)
    if (equals(pathname, `/${coin}/transactions`)) {
      const formValues = yield select(
        selectors.form.getFormValues(WALLET_TX_SEARCH)
      )
      const source = prop('source', formValues)
      const onlyShow = equals(source, 'all')
        ? ''
        : prop('xpub', source) || prop('address', source)
      yield put(actions.core.data[coin].fetchTransactions(onlyShow, true))
    }
  }

  const onClose = function * (action) {}

  return {
    onOpen,
    onMessage,
    onClose
  }
}
