import { call, put, select, take } from 'redux-saga/effects'
import { compose } from 'ramda'
import * as A from './actions'
import * as actions from '../../../actions'
import * as actionTypes from '../../../actionTypes'
import { Wrapper } from 'blockchain-wallet-v4/src/types'
import { Socket } from 'blockchain-wallet-v4/src/network'

// TO REVIEW
export default ({ api, btcSocket }) => {
  const onOpen = function * () {
    const subscribeInfo = yield select(actions.core.wallet.getInitialSocketContext)
    yield call(compose(btcSocket, Socket.onOpenMessage), subscribeInfo)
  }

  const dispatchLogoutEvent = function * () {
    yield window.dispatchEvent(new window.Event('wallet.core.logout'))
  }

  const onMessage = function * (action) {
    const message = action.payload

    switch (message.op) {
      case 'on_change':
        const newChecksum = message.x.checksum
        const wrapper = yield select(actions.core.wallet.getWrapper)
        const oldChecksum = Wrapper.selectPayloadChecksum(wrapper)
        if (oldChecksum !== newChecksum) {
          yield call(refreshWrapper)
          yield put(actions.core.data.bitcoin.fetchData())
        }
        break
      case 'utx':
        // TODO !!!!!!!!!!!!!!!!!
        yield put(actions.core.data.bitcoin.fetchTransactions('', true))

        const transactions = yield take(actionTypes.core.data.bitcoin.FETCH_BITCOIN_TRANSACTIONS_SUCCESS)
        for (let i in transactions.payload.transactions) {
          const tx = transactions.payload.transactions[i]
          if (tx.hash === message.x.hash) {
            if (tx.result > 0) {
              yield put(A.paymentReceived("You've just received a bitcoin payment."))
            }
            break
          }
        }
        break
      case 'block':
        const newBlock = message.x
        yield put(actions.core.data.bitcoin.setBitcoinLatestBlock(newBlock.blockIndex, newBlock.hash, newBlock.height, newBlock.time))
        break
      case 'pong':
        break
      case 'email_verified':
        yield put(actions.core.settings.setEmailVerified())
        break
      case 'wallet_logout':
        yield call(dispatchLogoutEvent)
        break

      default:
        console.log('unknown type for ', message)
        break
    }
  }

  const onClose = function * (action) {
  }

  const refreshWrapper = function * () {
    const guid = yield select(actions.core.wallet.getGuid)
    const skey = yield select(actions.core.wallet.getSharedKey)
    const password = yield select(actions.core.wallet.getMainPassword)
    try {
      const newWrapper = yield call(api.fetchWallet, guid, skey, undefined, password)
      yield put(actions.wallet.refreshWrapper(newWrapper))
    } catch (e) {
      console.log('REFRESH WRAPPER FAILED (WEBSOCKET) :: should dispatch error action ?')
    }
  }

  return {
    onOpen,
    onMessage,
    onClose
  }
}
