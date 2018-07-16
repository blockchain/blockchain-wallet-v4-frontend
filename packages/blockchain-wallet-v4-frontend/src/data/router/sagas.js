import { put } from 'redux-saga/effects'
import { actions } from 'data'

export default () => {
  const logLocation = 'modules/router/sagas'

  const changeLocation = function * () {
    try {
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'router change location', e))
    }
  }

  return {
    changeLocation
  }
}
