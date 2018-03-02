import { takeEvery, call, put, select } from 'redux-saga/effects'
import { compose } from 'ramda'
import * as A from '../actions'
import * as T from '../actionTypes'
import { Wrapper } from '../../types'
import * as walletSelectors from '../wallet/selectors'
import { Socket } from '../../network'

export const webSocketSaga = ({ api, socket } = {}) => {
  const send = socket.send.bind(socket)

  const onOpen = function * (action) {
    const subscribeInfo = yield select(walletSelectors.getInitialSocketContext)
    yield call(compose(send, Socket.onOpenMessage), subscribeInfo)
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
          yield call(refreshBlockchainData)
        }
        break
      case 'utx':
        yield call(refreshTransactionList)
        yield call(refreshBlockchainData)
        break
      case 'block':
        const newBlock = message.x
        yield put(A.data.bitcoin.setBitcoinLatestBlock(newBlock.blockIndex, newBlock.hash, newBlock.height, newBlock.time))
        yield call(refreshTransactionList)
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
    yield console.log('websocket closed')
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

  const refreshBlockchainData = function * () {
    const context = yield select(walletSelectors.getWalletContext)
    try {
      // yield call(commonSagas.fetchBlockchainData, { context })
    } catch (e) {
      console.log('REFRESH BLOCKCHAIN DATA FAILED (WEBSOCKET) :: should dispatch error action ?')
    }
  }

  const refreshTransactionList = function * () {
    // const addressFilter = yield select(compose(transSelectors.getAddressFilter, prop(dataPath)))
    // yield put(A.transactions.deleteTransactions())
    // yield put(A.transactions.fetchTransactions(addressFilter, 50))
  }

  return function * () {
    yield takeEvery(T.webSocket.OPEN_SOCKET, onOpen)
    yield takeEvery(T.webSocket.MESSAGE_SOCKET, onMessage)
    yield takeEvery(T.webSocket.CLOSE_SOCKET, onClose)
  }
}
