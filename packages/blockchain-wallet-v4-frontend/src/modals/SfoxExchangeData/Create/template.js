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
  const { handleSignup, emailVerification, smsVerified, smsNumber, uniqueEmail, handleEmailInUse, ui, cancel, signupError, busy } = props
  const emailVerified = emailVerification === 1
  const mobileVerified = smsVerified === 1

  return (
    <Row>
      <ColumnLeft emailVerified={emailVerified} mobileVerified={mobileVerified} changingEmail={ui.changingEmail} />
      <ColRight>
        <div>
          {
            emailVerified && mobileVerified && uniqueEmail
              ? <AcceptTerms handleSignup={handleSignup} handleEmailInUse={handleEmailInUse} uniqueEmail={uniqueEmail} signupError={signupError} busy={busy} setBusyOff={props.setBusyOff} />
              : !emailVerified
                ? <VerifyEmail cancel={cancel} />
                : <VerifyMobile smsNumber={smsNumber} />
          }
        </div>
      </ColRight>
    </Row>
  )
}

Create.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  emailVerification: PropTypes.number,
  smsVerified: PropTypes.number,
  smsNumber: PropTypes.string
}

export default reduxForm({ form: 'sfoxCreate' })(Create)
