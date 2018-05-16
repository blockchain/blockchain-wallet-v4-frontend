import { call, put, select } from 'redux-saga/effects'
import { compose } from 'ramda'
import * as A from '../../actions'
import * as walletSelectors from '../../wallet/selectors'
import { Socket } from '../../../network/index'
import * as bchActions from '../../data/bch/actions'

// TO REVIEW
export default ({ api, bchSocket }) => {
  const send = bchSocket.send.bind(bchSocket)

  const onOpen = function * () {
    const subscribeInfo = yield select(walletSelectors.getInitialSocketContext)
    yield call(compose(send, Socket.onOpenMessage), subscribeInfo)
  }

  const onMessage = function * (action) {
    const message = action.payload

    switch (message.op) {
      case 'utx':
        yield put(A.webSocket.bitcoin.paymentReceived('You\'ve just received a bitcoin cash payment.'))
        const walletContext = yield select(walletSelectors.getWalletContext)
        yield put(bchActions.fetchData(walletContext))
        yield put(bchActions.fetchTransactions('', true))
        break
      case 'block':
        const newBlock = message.x
        yield put(A.data.bch.setBCHLatestBlock(newBlock.blockIndex, newBlock.hash, newBlock.height, newBlock.time))
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
