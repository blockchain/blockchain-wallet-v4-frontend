import React from 'react'
import PropTypes from 'prop-types'

import AcceptTerms from './AcceptTerms'
import VerifyEmail from './VerifyEmail'
import { Row } from 'components/BuySell/Signup'

const Create = (props) => {
  const { handleSignup, oldEmail, signupError, ui, updateUI } = props

  const determineStep = () => {
    if (ui.create === 'change_email' || ui.create === 'enter_email_code') return 'email'
    return 'terms'
  }

  return (
    <Row>
      {determineStep() === 'email' && <VerifyEmail oldEmail={oldEmail} updateUI={updateUI} ui={ui} /> }
      {determineStep() === 'terms' && <AcceptTerms handleSignup={handleSignup} signupError={signupError} updateUI={updateUI} /> }
    </Row>
  )
}

Create.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  smsNumber: PropTypes.string
}

export default Create
