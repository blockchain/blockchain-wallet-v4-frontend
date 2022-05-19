import { call, delay, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'
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
      yield put(actions.form.startSubmit(INTEREST_UPLOAD_DOCUMENT))
      const formValues: InterestUploadDocumentFormValueTypes = yield select(
        selectors.form.getFormValues(INTEREST_UPLOAD_DOCUMENT)
      )
      yield call(api.storeEDDData, formValues)
      yield put(actions.form.reset(INTEREST_UPLOAD_DOCUMENT))
      yield put(actions.form.stopSubmit(INTEREST_UPLOAD_DOCUMENT))
      yield put(
        A.setStep({
          step: InterestUploadDocumentsStepType.UPLOAD_AND_VERIFIED
        })
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.logs.logErrorMessage(logLocation, 'save addtional documents', error))
      yield put(actions.alerts.displayError(C.SAVE_ADDITIONAL_DOCUMENTS_ERROR))
      yield put(actions.form.stopSubmit(INTEREST_UPLOAD_DOCUMENT, { _error: error }))
    }
  }

  const uploadFiles = function* ({ payload }: ReturnType<typeof A.uploadFiles>) {
    const { files } = payload
    try {
      yield call(api.storeEDDDocuments, files)
      yield put(
        A.setStep({
          step: InterestUploadDocumentsStepType.UPLOADED
        })
      )
      // edd status should be changed at this point we have to fetch new one
      yield put(actions.components.interest.fetchEDDStatus())
      // close also interest modal
      yield put(actions.modals.closeModal(ModalName.INTEREST_MODAL))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.logs.logErrorMessage(logLocation, 'save additional documents', error))
      yield put(actions.alerts.displayError(C.UPLOAD_ADDITIONAL_DOCUMENTS_FILES_ERROR))
    }
  }

  return {
    fetchEDDDocumentsLimits,
    saveAdditionalData,
    showModal,
    uploadFiles
  }
}
