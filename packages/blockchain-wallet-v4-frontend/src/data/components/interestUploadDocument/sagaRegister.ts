import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const interestUploadDocumentSagas = sagas({ api })

  return function* recurringBuySaga() {
    yield takeLatest(actions.showModal.type, interestUploadDocumentSagas.showModal)
    yield takeLatest(actions.uploadFiles.type, interestUploadDocumentSagas.uploadFiles)
    yield takeLatest(
      actions.saveAdditionalData.type,
      interestUploadDocumentSagas.saveAdditionalData
    )
    yield takeLatest(
      actions.fetchEDDDocumentsLimits.type,
      interestUploadDocumentSagas.fetchEDDDocumentsLimits
    )
  }
}
