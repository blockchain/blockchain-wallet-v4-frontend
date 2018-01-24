import { PUSH_TRANSACTION} from './actionTypes'
import { addTransaction, transactionPushed, transactionConfirmed} from './actions'
import { transactionsPath } from './selectors'

export const  BlockchainPollerSagas= (api) => {

  const pushTransaction = function * (action) {
    let {type, tx, requiredConfirmations} = action
    yield put(addTransaction, tx, requiredConfirmations)
    yield call(api.pushTx(tx))
    yield put(transactionPushed, tx)
  }

  const poll = function * (action) {
    let transactions = yield select(transactionsPath)

    let latestBlock = yield call(api.getLatestBlock)

    let latestBlockHeight = latestBlock.height

    for (let tx in Object.keys(transactions)) {

      switch (transactions[tx].status) {
        case NOT_PUSHED: {
          yield call(api.pushTx(tx))
          yield put(transactionPushed, tx)
        }
        case WAITING_FOR_CONFIRMATIONS: {
          let rawTx = yield call(api.getRawTx(tx))
          if (latestBlockHeight - rawTx.block_height > transactions[tx].requiredConfirmations) {
          }
        }
        case CONFIRMED: // Do nothing
      }
    }
  }

  const takeSagas = function * () {

    yield takeEvery(PUSH_TRANSACTION, pushTransaction)
  }

  return {
    pushTransaction,
    takeSagas
  }
}
