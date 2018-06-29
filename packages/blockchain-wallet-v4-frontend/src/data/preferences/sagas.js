import { put } from 'redux-saga/effects'
import * as actions from '../actions.js'
import * as C from 'services/AlertService'

export default () => {
  const logLocation = 'preferences/sagas'

  const setLanguage = function * (action) {
    try {
      yield put(actions.alerts.displaySuccess(C.LANGUAGE_UPDATE_SUCCESS))
      // update url with new language without forcing browser reload
      window.history.pushState({}, '', `/${action.payload.language}/${window.location.hash}`)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateLanguage', e))
      yield put(actions.alerts.displayError(C.LANGUAGE_UPDATE_ERROR))
    }
  }

  return {
    setLanguage
  }
}
