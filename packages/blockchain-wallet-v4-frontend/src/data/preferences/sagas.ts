import * as A from './actions'
import * as C from 'services/AlertService'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { addLanguageToUrl } from 'services/LocalesService'
import { put, select } from 'redux-saga/effects'

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

  const setSBFiatCurrency = function * () {
    try {
      const walletCurrencyR = selectors.core.settings.getCurrency(
        yield select()
      )
      const walletCurrency = walletCurrencyR.getOrElse(undefined)
      const sbFiatCurrency = S.getSBFiatCurrency(yield select())
      if (!walletCurrency) return
      if (!sbFiatCurrency) return

      if (sbFiatCurrency !== walletCurrency) {
        yield put(A.setSBFiatCurrency(walletCurrency))
      }
    } catch (e) {}
  }

  return {
    setLanguage,
    setSBFiatCurrency
  }
}
