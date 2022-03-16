import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const debitCardSagas = sagas({ api })

  return function* debitCardSaga() {
    yield takeLatest(actions.getProducts.type, debitCardSagas.getProducts)
    yield takeLatest(actions.createCard.type, debitCardSagas.createCard)
  }
}
