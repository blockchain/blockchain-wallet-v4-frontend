import { call, put, select, take } from 'redux-saga/effects'
import * as actions from '../../../actions'
import * as actionTypes from '../../../actionTypes'
import * as selectors from '../../../selectors'
import * as T from 'services/AlertService'
import { equals, prop } from 'ramda'
const ACCOUNT_SUB = 'account_sub'
const BLOCK_SUB = 'block_sub'

// TO REVIEW
export default ({ api, ethSocket }) => {
  const send = ethSocket.send.bind(ethSocket)

  const onOpen = function * () {
    try {
      yield call(send, JSON.stringify({ op: BLOCK_SUB }))
      yield take(actionTypes.core.kvStore.ethereum.FETCH_METADATA_ETHEREUM_SUCCESS)
      const contextR = yield select(selectors.core.kvStore.ethereum.getContext)
      const context = contextR.getOrFail('invalid_context_eth')
      yield call(send, JSON.stringify({ op: ACCOUNT_SUB, account: context }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage('middleware/webSocket/eth/sagas', 'onOpen', e.message))
    }
  }

  const onMessage = function * (action) {
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
            if (equals(pathname, '/etc/transactions')) {
              yield put(actions.core.data.ethereum.fetchTransactions(true))
            }
          }
          // Updates data
          const contextR = yield select(selectors.core.kvStore.ethereum.getContext)
          const context = contextR.getOrFail('invalid_context_eth')
          yield put(actions.core.data.ethereum.fetchData(context))
          break
        case BLOCK_SUB:
          yield put(actions.core.data.ethereum.fetchLatestBlock())
          break
        case 'pong':
          break
        default:
          console.log('unknown type for ', message)
          break
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage('middleware/webSocket/eth/sagas', 'onOpen', e.message))
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
