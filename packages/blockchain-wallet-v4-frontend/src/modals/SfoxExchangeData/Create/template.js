import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import AcceptTerms from './AcceptTerms'
import VerifyEmail from './VerifyEmail'
import VerifyMobile from './VerifyMobile'
import { Row } from 'components/BuySell/Signup'

const Create = (props) => {
  const { ui } = props
  const { create } = ui
  const { handleSignup, signupError } = props

  const determineStep = () => {
    switch (create) {
      case 'create_account': return <AcceptTerms handleSignup={handleSignup} signupError={signupError} {...props} />

      case 'change_email':
      case 'enter_email_code': return <VerifyEmail {...props} />

      case 'change_mobile':
      case 'enter_mobile_code': return <VerifyMobile {...props} />
    }
  }

  return (
    <Row>
      { determineStep() }
    </Row>
  )
}

Create.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  smsVerified: PropTypes.number,
  smsNumber: PropTypes.string
}

export default reduxForm({ form: 'sfoxCreate' })(Create)
