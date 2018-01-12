import { takeLatest, put, call, select } from 'redux-saga/effects'
import { assoc } from 'ramda'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
import * as selectors from '../../selectors.js'

// const initExchange = function * (action) {
//   try {
//     // We init the form
//     const source = yield select(selectors.core.wallet.getDefaultAccount)
//     const target = yield select(selectors.core.kvStore.ethereum.getDefaultAccount)
//     const initialValues = {
//       accounts: {
//         source: assoc('coin', 'BTC', source),
//         target: assoc('coin', 'ETH', target)
//       }
//     }
//     yield put(actions.form.initialize('exchange', initialValues))
//     // We fetch the current fee for our different crypto
//     yield call(sagas.core.kvStore.shapeShift.fetchShapeShift)
//     yield call(sagas.core.data.bitcoin.fetchFee)
//     yield call(sagas.core.data.ethereum.fetchFee)
//     yield call(sagas.core.data.shapeShift.fetchBtcEth)
//     yield call(sagas.core.data.shapeShift.fetchEthBtc)
//     // We get the effectiveBalance for bitcoin
//     const index = yield select(selectors.core.wallet.getDefaultAccountIndex)
//     yield call(sagas.core.data.bitcoin.fetchUnspent, index, undefined)
//     const feePerByte = yield select(selectors.core.data.bitcoin.getFeeRegular)
//     yield call(sagas.core.data.bitcoin.refreshEffectiveBalance, { feePerByte })
//   } catch (e) {
//     if (e !== 'No free outputs to spend') {
//       yield put(actions.alerts.displayError('Could not init shapeshift.'))
//     }
//   }
// }

// const createOrder = function * (action) {
//   try {
//     yield call(sagas.core.data.shapeShift.createOrder, action.payload)
//   } catch (e) {
//     yield put(actions.alerts.displayError('Cannot create shapeShift order'))
//   }
// }

// const resetExchange = function * () {
//   // We reset the form
//   yield put(actions.form.reset('exchange'))
// }

// export default function * () {
//   yield takeLatest(AT.INIT_EXCHANGE, initExchange)
//   yield takeLatest(AT.CREATE_ORDER, createOrder)
//   yield takeLatest(AT.RESET_EXCHANGE, resetExchange)
// }
