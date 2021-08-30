import { put } from 'redux-saga/effects'

import { APIType } from 'core/network/api'
import { actions } from 'data'
import { ModalName } from 'data/types'

import { actions as A } from './slice'
import { InterestUploadDocumentsStepType } from './types'

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

  return {
    showModal
  }
}
