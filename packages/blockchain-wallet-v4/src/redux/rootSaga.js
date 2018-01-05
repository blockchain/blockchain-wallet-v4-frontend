import { all, fork } from 'redux-saga/effects'
import dataBitcoinSaga from './data/bitcoin/rootSaga'
import dataEthereumSaga from './data/ethereum/rootSaga'
import dataMiscSaga from './data/misc/rootSaga'
import dataShapeShiftSaga from './data/shapeShift/rootSaga'
import kvStoreBuysellSaga from './kvStore/buySell/rootSaga'
import kvStoreContactsSaga from './kvStore/contacts/rootSaga'
import kvStoreEthereumSaga from './kvStore/ethereum/rootSaga'
import kvStoreShapeshiftSaga from './kvStore/shapeShift/rootSaga'
import kvStoreWhatsnewSaga from './kvStore/whatsNew/rootSaga'
import settingsSaga from './settings/rootSaga'

export const rootSaga = ({ api, socket } = {}) => {
  return function * () {
    yield all([
      fork(dataBitcoinSaga({ api })),
      fork(dataEthereumSaga({ api })),
      fork(dataMiscSaga({ api })),
      fork(dataShapeShiftSaga({ api })),
      fork(kvStoreBuysellSaga({ api })),
      fork(kvStoreContactsSaga({ api })),
      fork(kvStoreEthereumSaga({ api })),
      fork(kvStoreShapeshiftSaga({ api })),
      fork(kvStoreWhatsnewSaga({ api })),
      fork(settingsSaga({ api }))
    ])
  }
}
