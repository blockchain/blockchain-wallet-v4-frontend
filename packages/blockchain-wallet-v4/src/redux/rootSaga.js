import { all, fork } from 'redux-saga/effects'
import dataBitcoinSaga from './data/bitcoin/rootSaga'
import dataEthereumSaga from './data/ethereum/rootSaga'
import dataMiscSaga from './data/misc/rootSaga'
import dataShapeShiftSaga from './data/shapeShift/rootSaga'
import settingsSaga from './settings/rootSaga'

export const rootSaga = ({ api, socket } = {}) => {
  return function * () {
    yield all([
      fork(dataBitcoinSaga({ api })),
      fork(dataEthereumSaga({ api })),
      fork(dataMiscSaga({ api })),
      fork(dataShapeShiftSaga({ api })),
      fork(settingsSaga({ api }))
    ])
  }
}
