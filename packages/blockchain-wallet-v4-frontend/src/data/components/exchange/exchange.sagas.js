import { put } from 'redux-saga/effects'
import { actions } from 'data'

export default ({ api, coreSagas, options }) => {
  const exchangeFormInitialized = function*() {
    yield put(actions.modules.rates.fetchAvailablePairs())
  }

  return {
    exchangeFormInitialized
  }
}
