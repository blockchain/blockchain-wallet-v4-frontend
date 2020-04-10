import * as C from 'services/AlertService'
import { actions } from 'data'
import { addLanguageToUrl } from 'services/LocalesService'
import { put } from 'redux-saga/effects'

export default () => {
  const logLocation = 'preferences/sagas'

  const setLanguage = function * (action) {
    const { language, showAlert } = action.payload
    try {
      addLanguageToUrl(language)
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
