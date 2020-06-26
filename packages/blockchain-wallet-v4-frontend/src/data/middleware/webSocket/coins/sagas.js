import * as T from 'services/AlertService'
import { actions, selectors } from 'data'
import {
  btcTransaction,
  ethReceivedConfirmed,
  ethReceivedPending,
  ethSentConfirmed,
  header
} from './messageTypes'
import { call, put, select } from 'redux-saga/effects'
import { concat, equals, prop } from 'ramda'
import { WALLET_TX_SEARCH } from '../../../form/model'

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

      // 2. subscribe to btc xpubs
      const btcWalletContext = yield select(selectors.core.data.btc.getContext)
      const btcLockboxContext = (yield select(
        selectors.core.kvStore.lockbox.getLockboxBtcContext
      )).getOrElse([])
      const btcXPubs = concat(btcWalletContext, btcLockboxContext)
      btcXPubs.forEach(xpub =>
        send(
          JSON.stringify({
            command: 'subscribe',
            entity: 'xpub',
            coin: 'btc',
            param: { address: xpub }
          })
        )
      )

      // 3. subscribe to bch xpubs
      const bchWalletContext = yield select(selectors.core.data.bch.getContext)
      const bchLockboxContext = (yield select(
        selectors.core.kvStore.lockbox.getLockboxBchContext
      )).getOrElse([])
      const bchXPubs = concat(bchWalletContext, bchLockboxContext)
      bchXPubs.forEach(xpub =>
        send(
          JSON.stringify({
            command: 'subscribe',
            entity: 'xpub',
            coin: 'bch',
            param: { address: xpub }
          })
        )
      )

      // 4. subscribe to ethereum addresses
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

      // 5. subsribe wallet guid to get email verification updates
      const subscribeInfo = yield select(
        selectors.core.wallet.getInitialSocketContext
      )
      const guid = prop('guid', subscribeInfo)
      yield call(
        send,
        JSON.stringify({
          command: 'subscribe',
          entity: 'wallet',
          param: { guid }
        })
      )
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
              actions.alerts.displaySuccess(T.SEND_COIN_CONFIRMED, {
                coinName: 'Ethereum'
              })
            )
            yield put(actions.core.data.eth.fetchTransactions(null, true))
            yield put(actions.core.data.eth.fetchData([message.address]))
          } else if (ethReceivedPending(message)) {
            yield put(
              actions.alerts.displayInfo(T.PAYMENT_RECEIVED_ETH_PENDING)
            )
          } else if (ethReceivedConfirmed(message)) {
            yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_ETH))
            yield put(actions.core.data.eth.fetchTransactions(null, true))
            yield put(actions.core.data.eth.fetchData([message.address]))
          }
          break

        default:
          // check if message is an email verification update
          if (!!message.email && message.isVerified) {
            yield put(actions.core.settings.setEmailVerified())
            yield put(actions.alerts.displaySuccess(T.EMAIL_VERIFY_SUCCESS))
          }
          break
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          'middleware/webSocket/coins/sagas',
          'onMessage',
          e.message
        )
      )
    }
  }

  const sentOrReceived = function * (coin, message) {
    if (coin !== 'btc' && coin !== 'bch')
      throw new Error(
        `${coin} is not a valid coin. sentOrReceived only accepts btc and bch types.`
      )
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
    if (coin !== 'btc' && coin !== 'bch')
      throw new Error(
        `${coin} is not a valid coin. transactionsUpdate only accepts btc and bch types.`
      )
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

  const onClose = function * (action) {
    yield put(
      actions.logs.logErrorMessage(
        'middleware/webSocket/coins/sagas',
        'onClose',
        `websocket closed at ${Date.now()}`
      )
    )
  }

  return {
    onOpen,
    onMessage,
    onClose
  }
}
