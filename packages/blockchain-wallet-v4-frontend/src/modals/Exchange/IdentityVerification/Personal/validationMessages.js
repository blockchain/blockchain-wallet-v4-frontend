import React from 'react'
import { FormattedMessage } from 'react-intl'

import { model } from 'data'

const { EMAIL_EXISTS_ERROR } = model.components.identityVerification

const EmailExists = ({ email }) => (
  <FormattedMessage
    id='identityverification.personal.emailexistserror'
    defaultMessage='User with email {email} already exists. Please use different email'
    values={{ email }}
  />
)

const FallbackError = () => (
  <FormattedMessage
    id='identityverification.personal.error'
    defaultMessage='Failed to save personal data. Please try again'
  />
)

export const getValidationMessage = (error, email) => {
  if (error === EMAIL_EXISTS_ERROR) return <EmailExists email={email} />
  return <FallbackError />
}
