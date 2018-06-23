import { call, put, select } from 'redux-saga/effects'
import { compose, equals, prop } from 'ramda'
import * as actions from '../../../actions'
import * as selectors from '../../../selectors'
import * as T from 'services/AlertService'
import { Socket } from 'blockchain-wallet-v4/src/network'

// TO REVIEW
export default ({ api, bchSocket }) => {
  const send = bchSocket.send.bind(bchSocket)

  const onOpen = function * () {
    try {
      const subscribeInfo = yield select(selectors.core.wallet.getInitialSocketContext)
      yield call(compose(send, Socket.onOpenMessage), subscribeInfo)
    } catch (e) {
      yield put(actions.logs.logErrorMessage('middleware/webSocket/bch/sagas', 'onOpen', e.message))
    }
  }

  const onMessage = function * (action) {
    try {
      const message = action.payload

      switch (message.op) {
        case 'utx':
          // Find out if the transaction is sent/received to show a notification
          const context = yield select(selectors.core.wallet.getContext)
          const data = yield call(api.fetchBchData, context, { n: 50, offset: 0 })
          const transactions = data.txs || []
          for (let i in transactions) {
            const transaction = transactions[i]
            if (equals(transaction.hash, message.x.hash)) {
              if (transaction.result > 0) {
                yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_BCH))
              }
              break
            }
          }
          // Refresh data
          yield put(actions.core.data.bitcoin.fetchData())
          // If we are on the transaction page, fetch transactions related to the selected account
          const pathname = yield select(selectors.router.getPathname)
          if (equals(pathname, '/bch/transactions')) {
            const formValues = yield select(selectors.form.getFormValues('bchTransactions'))
            const source = prop('source', formValues)
            const onlyShow = equals(source, 'all') ? '' : (source.xpub || source.address)
            yield put(actions.core.data.bch.fetchTransactions(onlyShow, true))
          }
          break
        case 'block':
          // Update block
          const newBlock = message.x
          yield put(actions.core.data.bch.setBCHLatestBlock(newBlock.blockIndex, newBlock.hash, newBlock.height, newBlock.time))
          // Update balances

          break
        case 'pong':
          break
        default:
          yield put(actions.logs.logErrorMessage('middleware/webSocket/bch/sagas', 'onMessage', 'unknown type for ' + message))
          break
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage('middleware/webSocket/bch/sagas', 'onMessage', e.message))
    }
  }

  const onClose = function * (action) {
  }

  return {
    onOpen,
    onMessage,
    onClose
  }
}
