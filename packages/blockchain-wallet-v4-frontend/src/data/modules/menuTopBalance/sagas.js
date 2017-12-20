import { all, call, put, select, takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions'
import * as sagas from '../../sagas'
import * as selectors from '../../selectors'

export const init = function * (action) {
  try {
    // yield call(sagas.core.kvStore.ethereum.fetchEthereum)
    // const bitcoinContext = yield select(selectors.core.wallet.getWalletContext)
    // const etherContext = yield select(selectors.core.kvStore.ethereum.getContext)
    // yield all([
    //   call(sagas.core.common.bitcoin.fetchBlockchainData, { context: bitcoinContext }),
    //   call(sagas.core.common.ethereum.fetchEthereumData, { context: etherContext })
    // ])
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init menutop balance.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_MENUTOP_BALANCE, init)
}
