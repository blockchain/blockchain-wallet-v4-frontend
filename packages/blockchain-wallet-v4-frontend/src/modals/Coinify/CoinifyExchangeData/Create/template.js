import React from 'react'
import PropTypes from 'prop-types'

import AcceptTerms from './AcceptTerms'
import VerifyEmail from './VerifyEmail'
import { Row } from 'components/IdentityVerification'

const Create = props => {
  const {
    create,
    codeSent,
    handleSignup,
    oldEmail,
    signupError,
    updateState,
    country
  } = props
  const determineStep = () => {
    if (create === 'change_email' || create === 'enter_email_code') {
      return 'email'
    }
    return 'terms'
  }

  return (
    <Row>
      {determineStep() === 'email' && (
        <VerifyEmail
          oldEmail={oldEmail}
          updateState={updateState}
          create={create}
          codeSent={codeSent}
        />
      )}
      {determineStep() === 'terms' && (
        <AcceptTerms
          handleSignup={handleSignup}
          signupError={signupError}
          updateState={updateState}
          country={country}
        />
      )}
    </Row>
  )
}

Create.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  smsNumber: PropTypes.string
}

export default Create
