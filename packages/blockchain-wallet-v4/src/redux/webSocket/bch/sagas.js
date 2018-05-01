import { takeEvery, call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { compose } from 'ramda'
import * as A from '../../actions'
import * as AT from './actionTypes'
import * as walletSelectors from '../../wallet/selectors'
import { Socket } from '../../../network/index'
import * as bchActions from '../../data/bch/actions'

// TO REVIEW
export default ({ api, bchSocket }) => {
  const send = bchSocket.send.bind(bchSocket)
  let lastPongTimestamp = 0

  const onOpen = function * () {
    const subscribeInfo = yield select(walletSelectors.getInitialSocketContext)
    yield call(compose(send, Socket.onOpenMessage), subscribeInfo)
  }

  const onMessage = function * (action) {
    const message = action.payload

    switch (message.op) {
      case 'utx':
        const walletContext = yield select(walletSelectors.getWalletContext)
        yield put(bchActions.fetchData(walletContext))
        yield put(bchActions.fetchTransactions('', true))
        break
      case 'block':
        const newBlock = message.x
        yield put(A.data.bch.setBCHLatestBlock(newBlock.blockIndex, newBlock.hash, newBlock.height, newBlock.time))
        yield put(bchActions.fetchTransactions('', true))
        break
      case 'pong':
        lastPongTimestamp = Date.now()
        yield call(delay, 120000)
        if (lastPongTimestamp < Date.now() - 120000) {
          yield put(A.webSocket.bch.stopSocket())
          yield put(A.webSocket.bch.startSocket())
        }
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
