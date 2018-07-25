import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const { signIn } = sagas({ api })

  return function*() {
    yield takeLatest(AT.SIGN_IN, signIn)
  }
}
