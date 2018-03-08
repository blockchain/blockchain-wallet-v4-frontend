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
  const { handleSignup, emailVerified, smsNumber, smsVerified, uniqueEmail, handleEmailInUse, ui, doneChangingEmail, signupError, busy } = props

  return (
    <Row>
      <ColumnLeft emailVerified={emailVerified} smsVerified={smsVerified} changingEmail={ui.changingEmail} />
      <ColRight>
        <div>
          {
            emailVerified && smsVerified && uniqueEmail
              ? <AcceptTerms handleSignup={handleSignup} handleEmailInUse={handleEmailInUse} uniqueEmail={uniqueEmail} signupError={signupError} busy={busy} setBusyOff={props.setBusyOff} />
              : !emailVerified || !uniqueEmail
                ? <VerifyEmail doneChangingEmail={doneChangingEmail} uniqueEmail={uniqueEmail} />
                : <VerifyMobile smsNumber={smsNumber} />
          }
        </div>
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
