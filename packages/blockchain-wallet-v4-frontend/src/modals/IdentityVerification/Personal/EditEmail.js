import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { keys } from 'ramda'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, Form, reduxForm } from 'redux-form'

import {
  EMAIL_STEPS,
  EMAIL_FORM
} from 'data/components/identityVerification/model'
import { getEmailData } from './selectors'
import { required, validEmail } from 'services/FormHelper'
import media from 'services/ResponsiveService'
import { Text, Button, HeartbeatLoader } from 'blockchain-info-components'
import {
  ColLeft,
  ColRight,
  InputWrapper,
  PartnerHeader,
  PartnerSubHeader,
  ButtonWrapper,
  ColRightInner,
  EmailHelper
} from 'components/IdentityVerification'
import { TextBox } from 'components/Form'

const EmailInput = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
`
const EditEmailForm = styled(Form)`
  display: flex;
  flex-direction: row;
  width: 100%;
  ${media.mobile`
    flex-direction: column;
  `};
`

const emailHelper = ({ emailVerifiedError, resendCode, editEmail }) => {
  if (emailVerifiedError) {
    return (
      <FormattedMessage
        id='identityverification.personal.email.error'
        defaultMessage="That code doesn't match. {resend} or {changeEmail}."
        values={{
          resend: <a onClick={resendCode}>Resend</a>,
          changeEmail: <a onClick={editEmail}>change email</a>
        }}
      />
    )
  }
  return (
    <FormattedMessage
      id='identityverification.personal.email.didntreceive'
      defaultMessage="Didn't receive your email? {resend} or {changeEmail}."
      values={{
        resend: <a onClick={resendCode}>Resend</a>,
        changeEmail: <a onClick={editEmail}>change email</a>
      }}
    />
  )
}

const EditEmail = ({
  step,
  email,
  invalid,
  formBusy,
  updateEmail,
  editEmail,
  resendCode,
  verifyEmail,
  emailVerifiedError
}) => {
  const handleSubmit = e => {
    e.preventDefault()
    if (step === EMAIL_STEPS.edit) return updateEmail()
    if (step === EMAIL_STEPS.verify) return verifyEmail()
  }

  return (
    <EditEmailForm onSubmit={handleSubmit}>
      <ColLeft>
        <InputWrapper>
          <PartnerHeader>
            <FormattedMessage
              id='identityverification.personal.email.header'
              defaultMessage="What's your email?"
            />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage
              id='identityverification.personal.email.subheader'
              defaultMessage="Rest assured: there are only a few steps separating you from the good stuff. Let's start by confirming your verified email address and phone number."
            />
          </PartnerSubHeader>
          {step === EMAIL_STEPS.edit && (
            <EmailInput>
              <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
                <FormattedMessage
                  id='identityverification.personal.email.confirm'
                  defaultMessage='Confirm Email:'
                />
              </Text>
              <Field
                name='email'
                component={TextBox}
                validate={[required, validEmail]}
              />
            </EmailInput>
          )}
          {step === EMAIL_STEPS.verify && (
            <EmailInput>
              <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
                <FormattedMessage
                  id='identityverification.personal.email.code'
                  defaultMessage='We emailed a verification code to {email}'
                  values={{ email }}
                />
              </Text>
              <Field
                name='code'
                component={TextBox}
                errorBottom
                validate={[required]}
              />
              <EmailHelper error={emailVerifiedError}>
                {emailHelper({ emailVerifiedError, resendCode, editEmail })}
              </EmailHelper>
            </EmailInput>
          )}
        </InputWrapper>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <ButtonWrapper>
            {step === EMAIL_STEPS.edit && (
              <Button
                nature='primary'
                type='submit'
                fullwidth
                disabled={invalid}
              >
                <FormattedMessage
                  id='identityverification.personal.email.number'
                  defaultMessage='Send Email Verification Code'
                />
              </Button>
            )}
            {step === EMAIL_STEPS.verify && (
              <Button
                nature='primary'
                type='submit'
                fullwidth
                uppercase
                disabled={invalid || formBusy}
              >
                {!formBusy ? (
                  <FormattedMessage
                    id='identityverification.personal.continue'
                    defaultMessage='Continue'
                  />
                ) : (
                  <HeartbeatLoader height='20px' width='20px' color='white' />
                )}
              </Button>
            )}
          </ButtonWrapper>
        </ColRightInner>
      </ColRight>
    </EditEmailForm>
  )
}

EditEmail.propTypes = {
  editEmail: PropTypes.func.isRequired,
  updateEmail: PropTypes.func.isRequired,
  verifyEmail: PropTypes.func.isRequired,
  resendCode: PropTypes.func.isRequired,
  step: PropTypes.oneOf(keys(EMAIL_STEPS)).isRequired,
  emailVerifiedError: PropTypes.bool,
  email: PropTypes.string.isRequired,
  formBusy: PropTypes.bool.isRequired
}

const enhance = compose(
  connect(getEmailData),
  reduxForm({ form: EMAIL_FORM })
)

export default enhance(EditEmail)
