import React, { useCallback } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { UploadAndVerify } from 'components/Flyout/InterestUploadDocuments'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { InterestUploadDocumentFormValueTypes, InterestUploadDocumentsStepType } from 'data/types'

import { Props as _P, SuccessStateType } from '..'

const { INTEREST_UPLOAD_DOCUMENT } = model.components.interestUploadDocument

const UploadAndVerifyStep = ({
  documentLimits,
  interestUploadDocumentActions,
  submitData
}: Props) => {
  const nextStep = useCallback(
    () =>
      interestUploadDocumentActions.setStep({
        step: InterestUploadDocumentsStepType.UPLOADED
      }),
    [InterestUploadDocumentsStepType.UPLOADED]
  )
  const previousStep = useCallback(
    () =>
      interestUploadDocumentActions.setStep({
        step: InterestUploadDocumentsStepType.UPLOAD_AND_VERIFIED
      }),
    [InterestUploadDocumentsStepType.UPLOAD_AND_VERIFIED]
  )

  const additionalInformationProps = {
    documentLimits,
    nextStep,
    previousStep,
    submitData
  }

  return <UploadAndVerify {...additionalInformationProps} />
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues(INTEREST_UPLOAD_DOCUMENT)(
    state
  ) as InterestUploadDocumentFormValueTypes
})

const connector = connect(mapStateToProps)

export type Props = _P &
  ConnectedProps<typeof connector> & { submitData: (files) => void } & SuccessStateType

export default connector(UploadAndVerifyStep)
