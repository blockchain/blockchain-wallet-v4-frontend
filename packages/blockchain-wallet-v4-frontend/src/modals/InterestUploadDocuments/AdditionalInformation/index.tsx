import React, { useCallback } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { AdditionalInformation } from 'components/Flyout'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { InterestUploadDocumentFormValueTypes, InterestUploadDocumentsStepType } from 'data/types'

import { Props as _P, SuccessStateType } from '..'

const { INTEREST_UPLOAD_DOCUMENT } = model.components.interestUploadDocument

const AdditionalInformationStep = ({
  close,
  countryCode,
  formValues,
  handleSubmit,
  interestUploadDocumentActions
}: Props) => {
  const nextStep = useCallback(
    () =>
      interestUploadDocumentActions.setStep({
        step: InterestUploadDocumentsStepType.GET_STARTED
      }),
    [InterestUploadDocumentsStepType.GET_STARTED]
  )
  const additionalInformationProps = { close, countryCode, formValues, handleSubmit, nextStep }

  return <AdditionalInformation {...additionalInformationProps} />
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues(INTEREST_UPLOAD_DOCUMENT)(
    state
  ) as InterestUploadDocumentFormValueTypes
})

const connector = connect(mapStateToProps)

export type Props = _P &
  ConnectedProps<typeof connector> & { handleSubmit: () => void } & SuccessStateType

export default connector(AdditionalInformationStep)
