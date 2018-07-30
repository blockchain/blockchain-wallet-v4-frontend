import { put } from 'redux-saga/effects'
import * as actions from '../../actions'

export default ({ api, coreSagas }) => {
  const logLocation = 'components/lockbox/sagas'

  const deriveCarbonXpubs = function*() {
    try {
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'deriveCarbonXpubs', e)
      )
    }
  }

  return {
    deriveCarbonXpubs
  }
}
