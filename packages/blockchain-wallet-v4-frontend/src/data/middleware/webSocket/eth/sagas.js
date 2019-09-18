import { call, put, select } from 'redux-saga/effects'
import * as actions from '../../../actions'
import * as selectors from '../../../selectors'
import * as T from 'services/AlertService'
import { concat, toLower } from 'ramda'
const ACCOUNT_SUB = 'account_sub'
const BLOCK_SUB = 'block_sub'

export default ({ api, ethSocket }) => {
  const send = ethSocket.send.bind(ethSocket)

  const onOpen = function * () {
    try {
      // yield call(send, JSON.stringify({ command: "subscribe", entity: "header", coin: "eth" }))
      yield call(send, JSON.stringify({ op: BLOCK_SUB }))
      const walletContext = yield select(selectors.core.data.eth.getContext)
      const lockboxContext = (yield select(
        selectors.core.kvStore.lockbox.getLockboxEthContext
      )).getOrElse([])
      const context = concat(walletContext, lockboxContext)
      for (let i = 0; i < context.length; i++) {
        yield call(
          send,
          JSON.stringify({ op: ACCOUNT_SUB, account: toLower(context[i]) })
        )
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          'middleware/webSocket/eth/sagas',
          'onOpen',
          e.message
        )
      )
    }
  }

  const onMessage = function * (action) {
    try {
      const message = action.payload
      switch (message.op) {
        case ACCOUNT_SUB:
          if (message.tx.to === message.address) {
            yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_ETH))
            yield put(actions.core.data.eth.fetchTransactions(null, true))
          }
          const context = [message.address]
          yield put(actions.core.data.eth.fetchData(context))
          break
        case BLOCK_SUB:
          yield put(actions.core.data.eth.fetchLatestBlock())
          break
        case 'pong':
          break
        default:
          yield put(
            actions.logs.logErrorMessage(
              'middleware/webSocket/eth/sagas',
              'onMessage',
              'unknown type for ' + message
            )
          )
          break
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          'middleware/webSocket/eth/sagas',
          'onOpen',
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
