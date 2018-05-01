import { takeEvery, call, put, select } from 'redux-saga/effects'
import * as A from '../../actions'
import * as AT from './actionTypes'
import * as ethSelectors from '../../data/ethereum/selectors'
import * as ethActions from '../../data/ethereum/actions'

// TO REVIEW
export default ({ api, ethSocket }) => {
  const send = ethSocket.send.bind(ethSocket)

  const onOpen = function * () {
    // XXX we need to get account addresses here
    // const subscribeInfo = yield select(ethSelectors.getDefaultAddress)
    yield call(send, JSON.stringify({op: 'block_sub'}))
    yield call(send, JSON.stringify({op: 'account_sub', account: '0xe6cbafa68fdd504e7f7d79acb8349c767bf7e94a'}))// "0x0e23F536b5509eca1Cf4a1ef2E541589EaB4479C"}))
  }

  const onMessage = function * (action) {
    const message = action.payload
    console.log('received ethereum message', message)

    switch (message.op) {
      case 'utx':
        //const walletContext = yield select(walletSelectors.getWalletContext)
        //yield put(ethActions.fetchData(walletContext))
        //yield put(ethActions.fetchTransactions('', true))
        break
      case 'block':
        //const newBlock = message.x
        //yield put(A.data.bitcoin.setBitcoinLatestBlock(newBlock.blockIndex, newBlock.hash, newBlock.height, newBlock.time))
        //yield put(ethActions.fetchTransactions('', true))
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
