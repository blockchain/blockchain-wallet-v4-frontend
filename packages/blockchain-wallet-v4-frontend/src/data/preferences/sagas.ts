import { put } from 'redux-saga/effects'

import { actions } from 'data'
import * as C from 'services/alerts'
import { addLanguageToUrl } from 'services/locales'

export default () => {
  const logLocation = 'preferences/sagas'

  const setLanguage = function* (action) {
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

  const setLinkHandling = function () {
    // Register BTC links
    window.navigator.registerProtocolHandler('bitcoin', '/#/open/%s', 'Blockchain')

    // Register BCH links
    window.navigator.registerProtocolHandler('web+bitcoincash', '/#/open/%s', 'Blockchain')
  }

  return {
    setLanguage,
    setLinkHandling
  }
}
