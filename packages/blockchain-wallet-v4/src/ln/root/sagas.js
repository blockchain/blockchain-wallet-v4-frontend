
import { START_UP} from './actionTypes'
import {addPrivateKey} from './actions'
import { takeEvery} from 'redux-saga'
import { put, select } from 'redux-saga/effects'
import * as random from 'crypto'
import { path } from 'ramda'

export const LNRootSagas = () => {
  const startUp = function * (action) {
    //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', action)
    let privateKey = yield select(path(['ln', 'root', 'private_key']))
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', privateKey)
    if (privateKey !== undefined) {
      return
    }
    privateKey = random.randomBytes(32)
    yield put(addPrivateKey(privateKey.toString('hex')))
  }

  const takeSagas = function * () {
    yield takeEvery(START_UP, startUp)
  }

  return {
    takeSagas,
    startUp
  }
}
