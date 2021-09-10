import React from 'react'
import { connect } from 'react-redux'

import { Uploaded } from 'components/Flyout'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { InterestUploadDocumentFormValueTypes } from 'data/types'

const { INTEREST_UPLOAD_DOCUMENT } = model.components.interestUploadDocument

const UploadedStep = ({ close }: Props) => {
  const additionalInformationProps = { close }

  return <Uploaded {...additionalInformationProps} />
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues(INTEREST_UPLOAD_DOCUMENT)(
    state
  ) as InterestUploadDocumentFormValueTypes
})

const connector = connect(mapStateToProps)

export type Props = {
  close: () => void
}

export default connector(UploadedStep)
