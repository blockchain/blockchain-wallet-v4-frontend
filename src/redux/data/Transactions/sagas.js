// import { call, put } from 'redux-saga/effects'
// import * as A from './actions'

// export const ratesSaga = ({ api } = {}) => {

//   const loadTransactions = function * (action) {
//     try {
//       const context = action.payload
//       const data = yield call(api.fetchBlockchainData, context, { n: 50 })
//       yield put(A.addresses.loadAddressesData(data.addresses))
//       yield put(A.info.loadInfoData(data.wallet))
//       yield put(A.latestBlock.loadLatestBlockData(data.info.latest_block))
//       yield put(A.transactions.loadContextTxs(data.txs))
//     } catch (error) {
//       // probably there is no context (blank wallet)
//     }
//   }

//   return loadTransactions
// }
