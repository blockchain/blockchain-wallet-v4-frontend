import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import AcceptTerms from './AcceptTerms'
import VerifyEmail from './VerifyEmail'
import { Row } from 'components/BuySell/Signup'

const Create = (props) => {
  const { handleSignup, signupError, ui } = props

  const determineStep = () => {
    if (ui.create === 'change_email' || ui.create === 'enter_email_code') return 'email'
    return 'terms'
  }

  return (
    <Row>
      { determineStep() === 'email' && <VerifyEmail {...props} /> }
      { determineStep() === 'terms' && <AcceptTerms handleSignup={handleSignup} signupError={signupError} {...props} /> }
    </Row>
  )
}

Create.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  smsNumber: PropTypes.string
}

export default reduxForm({ form: 'coinifyCreate' })(Create)
