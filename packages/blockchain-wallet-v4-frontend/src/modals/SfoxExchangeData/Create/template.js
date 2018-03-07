import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { TextBox, Form } from 'components/Form'
import { Text, Button, Icon } from 'blockchain-info-components'
import { required } from 'services/FormHelper'

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
  const { handleSignup, emailVerification, smsVerified, smsNumber, uniqueEmail, handleEmailInUse, ui, doneChangingEmail } = props
  const emailVerified = emailVerification === 1
  const mobileVerified = smsVerified === 1

  return (
    <Row>
      <ColumnLeft emailVerified={emailVerified} mobileVerified={mobileVerified} changingEmail={ui.changingEmail} />
      <ColRight>
        <div>
          {
            emailVerified && mobileVerified && uniqueEmail
              ? <AcceptTerms handleSignup={handleSignup} handleEmailInUse={handleEmailInUse} uniqueEmail={uniqueEmail} />
              : !mobileVerified
                ? <VerifyMobile smsNumber={smsNumber} />
                : <VerifyEmail doneChangingEmail={doneChangingEmail} />
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
