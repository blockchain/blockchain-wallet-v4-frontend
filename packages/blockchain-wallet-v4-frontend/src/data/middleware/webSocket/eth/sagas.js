import { call, put, select, take } from 'redux-saga/effects'
import * as actions from '../../../actions'
import * as actionTypes from '../../../actionTypes'
import * as selectors from '../../../selectors'
import * as T from 'services/AlertService'
import { equals, concat } from 'ramda'
const ACCOUNT_SUB = 'account_sub'
const BLOCK_SUB = 'block_sub'

export default ({ api, ethSocket }) => {
  const send = ethSocket.send.bind(ethSocket)

  const onOpen = function*() {
    try {
      yield call(send, JSON.stringify({ op: BLOCK_SUB }))

      const walletContext = yield select(
        selectors.core.data.ethereum.getContext
      )

      yield take(
        actionTypes.core.kvStore.lockbox.FETCH_METADATA_LOCKBOX_SUCCESS
      )

      const lockboxContext = yield select(
        selectors.core.kvStore.lockbox.getLockboxEthContext
      )

      const context = concat(walletContext, lockboxContext.getOrElse([]))

      yield call(send, JSON.stringify({ op: ACCOUNT_SUB, account: context }))
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

  const onMessage = function*(action) {
    try {
      const message = action.payload

      switch (message.op) {
        case ACCOUNT_SUB:
          if (message.tx.type !== 'confirmed') {
            break
          }
          if (message.tx.to === message.account) {
            // Send notification
            yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_ETH))
            // If we are on the transaction page, fetch transactions related to the default eth account
            const pathname = yield select(selectors.router.getPathname)
            if (equals(pathname, '/eth/transactions')) {
              yield put(
                actions.core.data.ethereum.fetchTransactions(null, true)
              )
            }
          }
          // Updates data
          const context = [message.account]
          yield put(actions.core.data.ethereum.fetchData(context))
          break
        case BLOCK_SUB:
          yield put(actions.core.data.ethereum.fetchLatestBlock())
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

  const onClose = function*(action) {}

  return {
    onOpen,
    onMessage,
    onClose
  }
}
