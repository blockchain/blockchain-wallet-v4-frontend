import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const debitCardSagas = sagas({ api, coreSagas, networks })

  return function* debitCardSaga() {
    yield takeLatest(actions.getProducts.type, debitCardSagas.getProducts)
    yield takeLatest(actions.createCard.type, debitCardSagas.createCard)
    yield takeLatest(actions.getCards.type, debitCardSagas.getCards)
    yield takeLatest(actions.handleCardLock.type, debitCardSagas.handleCardLock)
    yield takeLatest(actions.terminateCard.type, debitCardSagas.terminateCard)
    yield takeLatest(actions.getEligibleAccounts.type, debitCardSagas.getEligibleAccounts)
  }
}
