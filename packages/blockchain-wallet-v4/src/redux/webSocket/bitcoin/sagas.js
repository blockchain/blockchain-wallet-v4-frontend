import { call, put, select, take } from 'redux-saga/effects'
import { compose } from 'ramda'
import * as A from '../../actions'
import { Wrapper } from '../../../types/index'
import * as walletSelectors from '../../wallet/selectors'
import { Socket } from '../../../network/index'
import * as btcActions from '../../data/bitcoin/actions'
import * as btcAT from '../../data/bitcoin/actionTypes'

// TO REVIEW
export default ({ api, btcSocket }) => {
  const send = btcSocket.send.bind(btcSocket)

  const onOpen = function * () {
    const subscribeInfo = yield select(walletSelectors.getInitialSocketContext)
    yield call(compose(send, Socket.onOpenMessage), subscribeInfo)
  }

  const dispatchLogoutEvent = function * () {
    yield window.dispatchEvent(new window.Event('wallet.core.logout'))
  }

  const onMessage = function * (action) {
    const message = action.payload

    switch (message.op) {
      case 'on_change':
        const newChecksum = message.x.checksum
        const wrapper = yield select(walletSelectors.getWrapper)
        const oldChecksum = Wrapper.selectPayloadChecksum(wrapper)
        if (oldChecksum !== newChecksum) {
          yield call(refreshWrapper)
          yield put(btcActions.fetchData())
        }
        break
      case 'utx':
        yield put(btcActions.fetchData('', true))
        const transactions = yield take(btcAT.FETCH_BITCOIN_TRANSACTIONS_SUCCESS)
        for (let i in transactions.payload.transactions) {
          const tx = transactions.payload.transactions[i]
          if (tx.hash === message.x.hash) {
            if (tx.result > 0) {
              yield put(A.webSocket.bitcoin.paymentReceived('You have just received a bitcoin payment.'))
            }
            break
          }
        }
        break
      case 'block':
        const newBlock = message.x
        yield put(A.data.bitcoin.setBitcoinLatestBlock(newBlock.blockIndex, newBlock.hash, newBlock.height, newBlock.time))
        break
      case 'pong':
        break
      case 'email_verified':
        yield put(A.settings.setEmailVerified())
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
    const guid = yield select(walletSelectors.getGuid)
    const skey = yield select(walletSelectors.getSharedKey)
    const password = yield select(walletSelectors.getMainPassword)
    try {
      const newWrapper = yield call(api.fetchWallet, guid, skey, undefined, password)
      yield put(A.wallet.refreshWrapper(newWrapper))
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
