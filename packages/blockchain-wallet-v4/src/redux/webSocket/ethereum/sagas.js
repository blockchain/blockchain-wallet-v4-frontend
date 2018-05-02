import { takeEvery, call, put, select, take } from 'redux-saga/effects'
import * as A from '../../actions'
import * as AT from './actionTypes'
import * as ethAT from '../../kvStore/ethereum/actionTypes'
import * as ethSelectors from '../../data/ethereum/selectors'
import * as ethActions from '../../data/ethereum/actions'

const ACCOUNT_SUB = 'account_sub'
const BLOCK_SUB = 'block_sub'

// TO REVIEW
export default ({ api, ethSocket }) => {
  const send = ethSocket.send.bind(ethSocket)

  const onOpen = function * () {
    const metadata = yield take(ethAT.FETCH_METADATA_ETHEREUM_SUCCESS)
    yield call(send, JSON.stringify({op: BLOCK_SUB}))
    yield call(send, JSON.stringify({op: ACCOUNT_SUB, account: metadata.payload.address}))
  }

  const onMessage = function * (action) {
    const message = action.payload
    // console.log('received ethereum message', message)

    switch (message.op) {
      case ACCOUNT_SUB:
        //const walletContext = yield select(walletSelectors.getWalletContext)
        //yield put(ethActions.fetchData(walletContext))
        break
      case BLOCK_SUB:
        console.log('ethereum block ', message)
        yield put(ethActions.fetchLatestBlock())
        yield put(ethActions.fetchTransactions('', true))
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

  return function * () {
    yield takeEvery(AT.OPEN_SOCKET, onOpen)
    yield takeEvery(AT.MESSAGE_SOCKET, onMessage)
    yield takeEvery(AT.CLOSE_SOCKET, onClose)
  }
}
