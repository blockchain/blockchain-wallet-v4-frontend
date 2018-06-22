import { call, put, select, take } from 'redux-saga/effects'
import * as actions from '../../../actions'
import * as selectors from '../../../selectors'
const ACCOUNT_SUB = 'account_sub'
const BLOCK_SUB = 'block_sub'

// TO REVIEW
export default ({ api, ethSocket }) => {
  const onOpen = function * () {
    yield call(ethSocket, JSON.stringify({op: BLOCK_SUB}))
    const metadata = yield take(actions.core.kvStore.ethereum.FETCH_METADATA_ETHEREUM_SUCCESS)
    for (let i in metadata.payload.value.ethereum.accounts) {
      yield call(ethSocket, JSON.stringify({op: ACCOUNT_SUB, account: metadata.payload.value.ethereum.accounts[i].addr}))
    }
  }

  const onMessage = function * (action) {
    const message = action.payload

    switch (message.op) {
      case ACCOUNT_SUB:
        if (message.tx.type !== 'confirmed') {
          break
        }
        if (message.tx.to === message.account) {
          yield put(actions.middleware.webSocket.btc.paymentReceived('You\'ve just received an Ethereum payment.'))
        }
        const context = yield select(selectors.core.kvStore.ethereum.getContext)
        yield put(actions.core.data.ethereum.fetchData(context.data))
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
  }

  const onClose = function * (action) {
  }

  return {
    onOpen,
    onMessage,
    onClose
  }
}
