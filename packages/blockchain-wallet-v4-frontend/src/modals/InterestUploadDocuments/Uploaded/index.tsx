import React, { useCallback } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { Uploaded } from 'components/Flyout'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { InterestUploadDocumentFormValueTypes, InterestUploadDocumentsStepType } from 'data/types'

import { Props as _P } from '..'

const { INTEREST_UPLOAD_DOCUMENT } = model.components.interestUploadDocument

const UploadedStep = ({
  close,
  formValues,
  handleSubmit,
  interestUploadDocumentActions
}: Props) => {
  const nextStep = useCallback(
    () =>
      interestUploadDocumentActions.setStep({
        step: InterestUploadDocumentsStepType.UPLOADED
      }),
    [InterestUploadDocumentsStepType.UPLOADED]
  )

  const additionalInformationProps = { close, formValues, handleSubmit, nextStep }

  return <Uploaded {...additionalInformationProps} />
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues(INTEREST_UPLOAD_DOCUMENT)(
    state
  ) as InterestUploadDocumentFormValueTypes
})

const connector = connect(mapStateToProps)

export type Props = _P & ConnectedProps<typeof connector> & { handleSubmit: () => void }

export default connector(UploadedStep)
