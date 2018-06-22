import { call, put, select, take } from 'redux-saga/effects'
import { compose } from 'ramda'
import * as actions from '../../../actions'
import * as actionTypes from '../../../actionTypes'
import { Socket } from 'blockchain-wallet-v4/src/network'

// TO REVIEW
export default ({ api, bchSocket }) => {
  const onOpen = function * () {
    const subscribeInfo = yield select(actions.core.wallet.getInitialSocketContext)
    yield call(compose(bchSocket, Socket.onOpenMessage), subscribeInfo)
  }

  const onMessage = function * (action) {
    const message = action.payload

    switch (message.op) {
      case 'utx':
        yield put(actions.core.data.bch.fetchTransactions('', true))
        const transactions = yield take(actionTypes.core.data.bch.FETCH_BCH_TRANSACTIONS_SUCCESS)
        for (let i in transactions.payload.transactions) {
          const tx = transactions.payload.transactions[i]
          if (tx.hash === message.x.hash) {
            if (tx.result > 0) {
              yield put(actions.middleware.webSocket.btc.paymentReceived('You\'ve just received a bitcoin payment.'))
            }
            break
          }
        }
        break
      case 'block':
        const newBlock = message.x
        yield put(actions.core.data.bch.setBCHLatestBlock(newBlock.blockIndex, newBlock.hash, newBlock.height, newBlock.time))
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
