import { takeEvery, call, put, select } from 'redux-saga/effects'
import { prop, compose } from 'ramda'
import * as A from '../actions'
import * as T from '../actionTypes'
import { Wrapper, Wallet } from '../../types'
import * as walletSelectors from '../wallet/selectors'
import { Socket } from '../../network'

export const webSocketSaga = ({ api, socket, walletPath } = {}) => {
  const send = socket.send.bind(socket)

  const onOpen = function * (action) {
    const wrapper = yield select(prop(walletPath))
    const subscribeInfo = walletSelectors.getInitialSocketContext(wrapper)
    yield call(compose(send, Socket.onOpenMessage), subscribeInfo)
  }

  const onMessage = function * (action) {
    const message = action.payload

    switch (message.op) {
      case 'on_change':
        const newChecksum = message.x.checksum
        const wrapper = yield select(prop(walletPath))
        const oldChecksum = Wrapper.selectPayloadChecksum(wrapper)
        if (oldChecksum !== newChecksum) {
          yield call(refreshWallet)
        }
        break
      case 'utx':
        // TODO :: a transaction has arribed (fetch tx again ?)
        //   WalletStore.sendEvent('on_tx_received', obj.x);
        //   var sendOnTx = WalletStore.sendEvent.bind(null, 'on_tx');
        //   MyWallet.wallet.getHistory().then(sendOnTx);
        break
      case 'block':
        const newBlock = message.x
        yield put(A.latestBlock.setLatestBlock(newBlock.blockIndex, newBlock.hash, newBlock.height, newBlock.time))
        yield put(A.transactions.deleteTransactions())
        // TODO :: see what transactions I need to load or bump confirmatins?
        break
      case 'pong':
        // Do nothing
        break
      case 'email_verified':
        //   MyWallet.wallet.accountInfo.isEmailVerified = Boolean(obj.x);
        //   WalletStore.sendEvent('on_email_verified', obj.x);
        break
      case 'wallet_logout':
        // WalletStore.sendEvent('wallet_logout', obj.x);
        break

      default:
        break
    }
  }

  const onClose = function * (action) {
    console.log('websocket closed')
  }

  const refreshWallet = function * () {
    const guid = yield select(compose(Wallet.selectGuid, Wrapper.selectWallet, prop(walletPath)))
    const skey = yield select(compose(Wallet.selectSharedKey, Wrapper.selectWallet, prop(walletPath)))
    const password = yield select(compose(Wrapper.selectPassword, prop(walletPath)))
    try {
      const newWrapper = yield call(api.fetchWallet, guid, skey, undefined, password)
      yield put(A.wallet.setWrapper(newWrapper))
      const newContext = walletSelectors.getWalletContext(newWrapper)
      yield put(A.common.fetchBlockchainData(newContext))
      // Maybe we should dispatch a on-change actions to notify frontend in case it needs to show notification
    } catch (e) {
      console.log('REFRESH WALLET FAILED (WEBSOCKET) :: should dispatch error action ?')
    }
  }
  
  return function * () {
    yield takeEvery(T.webSocket.OPEN_SOCKET, onOpen)
    yield takeEvery(T.webSocket.MESSAGE_SOCKET, onMessage)
    yield takeEvery(T.webSocket.CLOSE_SOCKET, onClose)
  }
}
