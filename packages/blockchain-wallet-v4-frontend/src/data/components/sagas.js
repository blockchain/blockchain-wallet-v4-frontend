import { all, fork } from 'redux-saga/effects'
import sendBtc from './sendBtc/sagas'

export default ({ api, coreSagas }) => function * () {
  yield all([
    fork(sendBtc({ api, coreSagas }))
  ])
}
