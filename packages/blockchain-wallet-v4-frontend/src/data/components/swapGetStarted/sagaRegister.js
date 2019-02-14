import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const swapGetStartedSagas = sagas()

  return function* swapGetStartedSaga () {
    yield takeLatest(
      AT.SWAP_GET_STARTED_SUBMIT_CLICK,
      swapGetStartedSagas.swapGetStartedSubmitClicked
    )
  }
}
