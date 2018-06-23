import { call, put, select } from 'redux-saga/effects'
import { compose, equals, prop } from 'ramda'
import * as actions from '../../../actions'
import * as selectors from '../../../selectors'
import * as T from 'services/AlertService'
import { Wrapper } from 'blockchain-wallet-v4/src/types'
import { Socket } from 'blockchain-wallet-v4/src/network'

export default ({ api, btcSocket }) => {
  const send = btcSocket.send.bind(btcSocket)

  const onOpen = function * () {
    try {
      const subscribeInfo = yield select(selectors.core.wallet.getInitialSocketContext)
      yield call(compose(send, Socket.onOpenMessage), subscribeInfo)
    } catch (e) {
      yield put(actions.logs.logErrorMessage('middleware/webSocket/btc/sagas', 'onOpen', e.message))
    }
  }

  const dispatchLogoutEvent = function * () {
    yield window.dispatchEvent(new window.Event('wallet.core.logout'))
  }

  const onMessage = function * (action) {
    try {
      const message = action.payload

      switch (message.op) {
        case 'on_change':
          const newChecksum = message.x.checksum
          const wrapper = yield select(selectors.core.wallet.getWrapper)
          const oldChecksum = Wrapper.selectPayloadChecksum(wrapper)
          if (oldChecksum !== newChecksum) {
            yield call(refreshWrapper)
            yield put(actions.core.data.bitcoin.fetchData())
          }
          break
        case 'utx':
          // Find out if the transaction is sent/received to show a notification
          const context = yield select(selectors.core.wallet.getContext)
          const data = yield call(api.fetchBlockchainData, context, { n: 50, offset: 0 })
          const transactions = data.txs || []
          for (let i in transactions) {
            const transaction = transactions[i]
            if (equals(transaction.hash, message.x.hash)) {
              if (transaction.result > 0) {
                yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_BTC))
              }
              break
            }
          }
          // Refresh data
          yield put(actions.core.data.bitcoin.fetchData())
          // If we are on the transaction page, fetch transactions related to the selected account
          const pathname = yield select(selectors.router.getPathname)
          if (equals(pathname, '/btc/transactions')) {
            const formValues = yield select(selectors.form.getFormValues('btcTransactions'))
            const source = prop('source', formValues)
            const onlyShow = equals(source, 'all') ? '' : (source.xpub || source.address)
            yield put(actions.core.data.bitcoin.fetchTransactions(onlyShow, true))
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
    } catch (e) {
      yield put(actions.logs.logErrorMessage('middleware/webSocket/btc/sagas', 'onMessage', e.message))
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
      yield put(actions.logs.logErrorMessage('middleware/webSocket/btc/sagas', 'onMessage', 'REFRESH WRAPPER FAILED (WEBSOCKET)'))
    }
  }

  return {
    onOpen,
    onMessage,
    onClose
  }
}
