import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import AcceptTerms from './AcceptTerms'
import VerifyEmail from './VerifyEmail'
import VerifyMobile from './VerifyMobile'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const Create = (props) => {
  const { ui } = props
  const { handleSignup, signupError } = props

  const determineStep = () => {
    switch (ui.create) {
      case 'create_account': return 'terms'

      case 'change_email':
      case 'enter_email_code': return 'email'

      case 'change_mobile':
      case 'enter_mobile_code': return 'mobile'
    }
  }

  return (
    <Row>
      { determineStep() === 'email' && <VerifyEmail {...props} /> }
      { determineStep() === 'mobile' && <VerifyMobile {...props} /> }
      { determineStep() === 'terms' && <AcceptTerms handleSignup={handleSignup} signupError={signupError} {...props} /> }
    </Row>
  )
}

Create.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  smsVerified: PropTypes.number,
  smsNumber: PropTypes.string
}

export default reduxForm({ form: 'sfoxCreate' })(Create)
