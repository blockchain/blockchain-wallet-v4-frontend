import { put } from 'redux-saga/effects'
import * as actions from '../actions.js'
import * as C from 'services/AlertService'
import { addLanguageToUrl } from 'services/LocalesService'

export default ({ imports }) => {
  const logLocation = 'preferences/sagas'

  const setLanguage = function * (action) {
    const { language, showAlert } = action.payload
    try {
      imports.addLanguageToUrl(language)
      if (showAlert) {
        yield put(actions.alerts.displaySuccess(C.LANGUAGE_UPDATE_SUCCESS))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'updateLanguage', e))
      yield put(actions.alerts.displayError(C.LANGUAGE_UPDATE_ERROR))
    }
  }

  return {
    setLanguage
  }
}
