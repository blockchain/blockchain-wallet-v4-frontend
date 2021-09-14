import { call, put, select } from 'redux-saga/effects'

import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { APIType } from 'core/network/api'
import { actions, model, selectors } from 'data'
import { ModalName } from 'data/types'
import * as C from 'services/alerts'

import { actions as A } from './slice'
import { InterestUploadDocumentFormValueTypes, InterestUploadDocumentsStepType } from './types'

const logLocation = 'components/interestUploadDocument/sagas'

const { INTEREST_UPLOAD_DOCUMENT } = model.components.interestUploadDocument

export default ({ api }: { api: APIType }) => {
  const showModal = function* ({ payload }: ReturnType<typeof A.showModal>) {
    const { origin } = payload
    yield put(
      actions.modals.showModal(ModalName.INTEREST_UPLOAD_DOCUMENT_MODAL, {
        origin
      })
    )

    yield put(
      A.setStep({
        step: InterestUploadDocumentsStepType.INIT_PAGE
      })
    )
  }

  const fetchEDDDocumentsLimits = function* () {
    try {
      yield put(A.fetchEDDDocumentsLimitsLoading())
      const documentLimits: ReturnType<typeof api.getEDDDocumentsLimits> = yield call(
        api.getEDDDocumentsLimits
      )
      yield put(A.fetchEDDDocumentsLimitsSuccess(documentLimits))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchEDDDocumentsLimitsFailure(error))
    }
  }

  const saveAdditionalData = function* () {
    try {
      const formValues: InterestUploadDocumentFormValueTypes = yield select(
        selectors.form.getFormValues(INTEREST_UPLOAD_DOCUMENT)
      )
      const saveDocumentsResponse: ReturnType<typeof api.storeEDDDocuments> = yield call(
        api.storeEDDData,
        formValues
      )
      if (saveDocumentsResponse) {
        actions.form.reset(INTEREST_UPLOAD_DOCUMENT)
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.logs.logErrorMessage(logLocation, 'save addtional documents', error))
      yield put(actions.alerts.displayError(C.SAVE_ADDITIONAL_DOCUMENTS_ERROR))
    }
  }

  const uploadFiles = function* ({ payload }: ReturnType<typeof A.uploadFiles>) {
    const { files } = payload
    try {
      const fileUploadResponse: ReturnType<typeof api.storeEDDDocuments> = yield call(
        api.storeEDDDocuments,
        files
      )
      if (fileUploadResponse) {
        yield put(
          A.setStep({
            step: InterestUploadDocumentsStepType.UPLOADED
          })
        )
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.logs.logErrorMessage(logLocation, 'save addtional documents', error))
      yield put(actions.alerts.displayError(C.UPLOAD_ADDITIONAL_DOCUMNETS_FILES_ERROR))
    }
  }

  return {
    fetchEDDDocumentsLimits,
    saveAdditionalData,
    showModal,
    uploadFiles
  }
}
