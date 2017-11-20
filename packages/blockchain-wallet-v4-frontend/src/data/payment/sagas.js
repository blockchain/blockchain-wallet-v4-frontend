import { all, fork } from 'redux-saga/effects'
import bitcoin from './bitcoin/sagas.js'
import ethereum from './ethereum/sagas.js'

const rootSaga = function * () {
  yield all([
    fork(bitcoin),
    fork(ethereum)
  ])
}

export default rootSaga
