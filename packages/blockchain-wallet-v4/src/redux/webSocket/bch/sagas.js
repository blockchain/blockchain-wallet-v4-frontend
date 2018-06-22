import { call, put, select, take } from 'redux-saga/effects'
import { compose } from 'ramda'
import * as A from '../../actions'
import * as walletSelectors from '../../wallet/selectors'
import { Socket } from '../../../network/index'
import * as bchActions from '../../data/bch/actions'
import * as bchAT from '../../data/bch/actionTypes'

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
        yield put(bchActions.fetchTransactions('', true))
        const transactions = yield take(bchAT.FETCH_BCH_TRANSACTIONS_SUCCESS)
        for (let i in transactions.payload.transactions) {
          const tx = transactions.payload.transactions[i]
          if (tx.hash === message.x.hash) {
            if (tx.result > 0) {
              yield put(A.webSocket.bch.paymentReceived('Test'))
            }
            break
          }
        }
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
