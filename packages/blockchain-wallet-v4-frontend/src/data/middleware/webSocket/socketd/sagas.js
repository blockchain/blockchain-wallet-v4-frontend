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
  bitcoinTransaction
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

      // 5. subscribe to ethereum addresses
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
          } else if (bitcoinTransaction(message)) {
            // check of sent or received
            const context = yield select(selectors.core.data.btc.getContext)
            const data = yield call(api.fetchBlockchainData, context, {
              n: 50,
              offset: 0
            })
            const transactions = data.txs || []
            for (let i in transactions) {
              const transaction = transactions[i]
              if (equals(transaction.hash, message.transaction.hash)) {
                if (transaction.result > 0) {
                  yield put(
                    actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_BTC)
                  )
                }
                break
              }
            }

            // refresh data
            yield put(actions.core.data.btc.fetchData())

            // if on transactions page, update
            const pathname = yield select(selectors.router.getPathname)
            if (equals(pathname, '/btc/transactions')) {
              const formValues = yield select(
                selectors.form.getFormValues(WALLET_TX_SEARCH)
              )
              const source = prop('source', formValues)
              const onlyShow = equals(source, 'all')
                ? ''
                : prop('xpub', source) || prop('address', source)
              yield put(actions.core.data.btc.fetchTransactions(onlyShow, true))
            }
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
          } else if (bitcoinTransaction(message)) {
            // check of sent or received
            const context = yield select(selectors.core.data.btc.getContext)
            const data = yield call(api.fetchBlockchainData, context, {
              n: 50,
              offset: 0
            })
            const transactions = data.txs || []
            for (let i in transactions) {
              const transaction = transactions[i]
              if (equals(transaction.hash, message.transaction.hash)) {
                if (transaction.result > 0) {
                  yield put(
                    actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_BTC)
                  )
                }
                break
              }
            }

            // refresh data
            yield put(actions.core.data.bch.fetchData())

            // if on transactions page, update
            const pathname = yield select(selectors.router.getPathname)
            if (equals(pathname, '/bch/transactions')) {
              const formValues = yield select(
                selectors.form.getFormValues(WALLET_TX_SEARCH)
              )
              const source = prop('source', formValues)
              const onlyShow = equals(source, 'all')
                ? ''
                : prop('xpub', source) || prop('address', source)
              yield put(actions.core.data.bch.fetchTransactions(onlyShow, true))
            }
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
