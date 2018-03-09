import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import ColumnLeft from './ColumnLeft'
import AcceptTerms from './AcceptTerms'
import VerifyEmail from './VerifyEmail'
import VerifyMobile from './VerifyMobile'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`
const ColRight = styled.div`
  width: 60%;
`

const Create = (props) => {
  const { ui } = props
  const { handleSignup, emailVerified, smsNumber, smsVerified, signupError, busy } = props

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
      <ColumnLeft emailVerified={emailVerified} smsVerified={smsVerified} changingEmail={ui.changingEmail} />
      <ColRight>
        <div>
          { determineStep() === 'email' && <VerifyEmail {...props} /> }
          { determineStep() === 'mobile' && <VerifyMobile smsNumber={smsNumber} /> }
          { determineStep() === 'terms' && <AcceptTerms handleSignup={handleSignup} signupError={signupError} busy={busy} setBusyOff={props.setBusyOff} {...props} /> }
        </div>
        {/* <div>
          { determineStep() === 'email' && <VerifyEmail doneChangingEmail={doneChangingEmail} uniqueEmail={uniqueEmail} /> }
          { determineStep() === 'mobile' && <VerifyMobile smsNumber={smsNumber} /> }
          { determineStep() === 'terms' && <AcceptTerms handleSignup={handleSignup} handleEmailInUse={handleEmailInUse} uniqueEmail={uniqueEmail} signupError={signupError} busy={busy} setBusyOff={props.setBusyOff} /> }
        </div> */}
      </ColRight>
    </Row>
  )
}

Create.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  smsVerified: PropTypes.number,
  smsNumber: PropTypes.string
}

export default reduxForm({ form: 'sfoxCreate' })(Create)
