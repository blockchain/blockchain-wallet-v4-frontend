import { all, fork } from 'redux-saga/effects'
import dataBitcoinSaga from './data/bitcoin/rootSaga'
import dataCoinifySaga from './data/coinify/rootSaga'
import dataEthereumSaga from './data/ethereum/rootSaga'
import dataBchSaga from './data/bch/rootSaga'
import dataMiscSaga from './data/misc/rootSaga'
import dataSfoxSaga from './data/sfox/rootSaga'
import dataShapeShiftSaga from './data/shapeShift/rootSaga'
import kvStoreBchSaga from './kvStore/bch/rootSaga'
import kvStoreBuysellSaga from './kvStore/buySell/rootSaga'
import kvStoreContactsSaga from './kvStore/contacts/rootSaga'
import kvStoreEthereumSaga from './kvStore/ethereum/rootSaga'
import kvStoreShapeshiftSaga from './kvStore/shapeShift/rootSaga'
import kvStoreWhatsnewSaga from './kvStore/whatsNew/rootSaga'
import optionsSaga from './walletOptions/rootSaga'
import settingsSaga from './settings/rootSaga'

export const rootSaga = ({ api, socket, sfoxService, coinifyService } = {}) => {
  return function * () {
    yield all([
      fork(dataBitcoinSaga({ api })),
      fork(dataCoinifySaga({ api, coinifyService })),
      fork(dataEthereumSaga({ api })),
      fork(dataBchSaga({ api })),
      fork(dataMiscSaga({ api })),
      fork(dataSfoxSaga({ api, sfoxService })),
      fork(dataShapeShiftSaga({ api })),
      fork(kvStoreBchSaga({ api })),
      fork(kvStoreBuysellSaga({ api })),
      fork(kvStoreContactsSaga({ api })),
      fork(kvStoreEthereumSaga({ api })),
      fork(kvStoreShapeshiftSaga({ api })),
      fork(kvStoreWhatsnewSaga({ api })),
      fork(optionsSaga({ api })),
      fork(settingsSaga({ api }))
    ])
  }
}
