import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { keys } from 'ramda'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { EMAIL_STEPS, EMAIL_FORM } from 'data/components/identityVerification/model'
import { getEmailData } from './selectors'
import { required, validEmail } from 'services/FormHelper'
import { spacing } from 'services/StyleService'
import media from 'services/ResponsiveService'
import { Text, Button } from 'blockchain-info-components'
import { ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader,
  ButtonWrapper, ColRightInner, EmailHelper } from 'components/IdentityVerification'
import { TextBox } from 'components/Form'

const EmailInput = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
`
const EditEmailWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  ${media.mobile`
    flex-direction: column;
  `}
`

const emailHelper = ({ emailVerifiedError, resendCode, editEmail }) => {
  if (emailVerifiedError) {
    return <FormattedMessage
      id='identityverification.personal.email.error'
      defaultMessage="That code doesn't match. {resend} or {changeEmail}."
      values={{ resend: <a onClick={resendCode}>Resend</a>, changeEmail: <a onClick={editEmail}>change email</a> }}
    />
  }
  return <FormattedMessage
    id='identityverification.personal.email.didntreceive'
    defaultMessage="Didn't receive your email? {resend} or {changeEmail}."
    values={{ resend: <a onClick={resendCode}>Resend</a>, changeEmail: <a onClick={editEmail}>change email</a> }}
  />
}

const EditEmail = (
  { step, email, resendCode, invalid, updateEmail, editEmail, verifyEmail, emailVerifiedError }
) =>
  <EditEmailWrapper>
    <ColLeft>
      <InputWrapper>
        <PartnerHeader>
          <FormattedMessage id='identityverification.personal.email.header' defaultMessage="What's your email?" />
        </PartnerHeader>
        <PartnerSubHeader>
          <FormattedMessage id='identityverification.personal.email.subheader' defaultMessage="Rest assured: there are only a few steps separating you from the good stuff. Let's start by confirming your verified email address and phone number." />
        </PartnerSubHeader>
        { step === EMAIL_STEPS.edit && <EmailInput>
          <Text size='14px' weight={400} style={{'marginBottom': '5px'}}>
            <FormattedMessage id='identityverification.personal.email.confirm' defaultMessage='Confirm Email:' />
          </Text>
          <Field name='email' component={TextBox} validate={[required, validEmail]} />
          <Button nature='primary' onClick={updateEmail} disabled={invalid} style={spacing('mt-15')}>
            <FormattedMessage id='identityverification.personal.email.number' defaultMessage='Send Email Verification Code' />
          </Button>
        </EmailInput> }
        { step === EMAIL_STEPS.verify && <EmailInput>
          <Text size='14px' weight={400} style={{'marginBottom': '5px'}}>
            <FormattedMessage id='identityverification.personal.email.code' defaultMessage='We emailed a verification code to {email}' values={{ email }} />
          </Text>
          <Field name='code' component={TextBox} errorBottom validate={[required]} />
          <EmailHelper error={emailVerifiedError}>
            { emailHelper({ emailVerifiedError, resendCode, editEmail }) }
          </EmailHelper>
        </EmailInput> }
      </InputWrapper>
    </ColLeft>
    <ColRight>
      <ColRightInner>
        <ButtonWrapper>
          <Button nature='primary' onClick={verifyEmail} fullwidth uppercase disabled={invalid || step === EMAIL_STEPS.edit}>
            <FormattedMessage id='identityverification.personal.continue' defaultMessage='Continue' />
          </Button>
        </ButtonWrapper>
      </ColRightInner>
    </ColRight>
  </EditEmailWrapper>

EditEmail.propTypes = {
  editEmail: PropTypes.func.isRequired,
  updateEmail: PropTypes.func.isRequired,
  verifyEmail: PropTypes.func.isRequired,
  resendCode: PropTypes.func.isRequired,
  step: PropTypes.oneOf(keys(EMAIL_STEPS)).isRequired,
  emailVerifiedError: PropTypes.bool,
  email: PropTypes.string.isRequired
}

const enhance = compose(
  connect(getEmailData),
  reduxForm({ form: EMAIL_FORM })
)

export default enhance(EditEmail)
