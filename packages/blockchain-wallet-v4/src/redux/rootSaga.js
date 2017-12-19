import { all, fork } from 'redux-saga/effects'
import bitcoinDataSaga from './data/bitcoin/rootSaga'
import ethereumDataSaga from './data/ethereum/rootSaga'

export const rootSaga = ({ api, socket } = {}) => {
  return function * () {
    yield all([
      fork(bitcoinDataSaga({ api })),
      fork(ethereumDataSaga({ api }))
    ])
  }
}
