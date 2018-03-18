import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import AcceptTerms from './AcceptTerms'
import VerifyEmail from './VerifyEmail'
// import VerifyMobile from './VerifyMobile'
import { Row } from 'components/BuySell/Signup'

const Create = (props) => {
  const { ui } = props
  const { handleSignup, signupError } = props

  const determineStep = () => {
    console.log('determine step', ui)
    return 'terms'
    // switch (ui.create) {
    //   case 'create_account': return 'terms'
    //
    //   case 'change_email':
    //   case 'enter_email_code': return 'email'
    // }
  }

  return (
    <Row>
      {/* { determineStep() === 'email' && <VerifyEmail {...props} /> } */}
      {/* { determineStep() === 'mobile' && <VerifyMobile {...props} /> } */}
      { determineStep() === 'terms' && <AcceptTerms handleSignup={handleSignup} signupError={signupError} {...props} /> }
    </Row>
  )
}

Create.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  // smsVerified: PropTypes.number,
  smsNumber: PropTypes.string
}

export default reduxForm({ form: 'coinifyCreate' })(Create)
