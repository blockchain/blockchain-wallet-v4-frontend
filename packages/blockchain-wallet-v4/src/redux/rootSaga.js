import { all, fork } from 'redux-saga/effects'
import { bitcoinSaga } from './data/bitcoin/rootSaga'

export const rootSaga = ({ api, socket } = {}) => {
  console.log('rootSagaCreator')
  return function * () {
    console.log('rootSagaIn')
    yield all([
      fork(bitcoinSaga({ api }))
    ])
  }
}
