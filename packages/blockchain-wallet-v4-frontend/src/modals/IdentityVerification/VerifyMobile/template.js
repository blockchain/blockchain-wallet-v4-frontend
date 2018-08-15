import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { model } from 'data'
import { required, validMobileNumber } from 'services/FormHelper'

import { Button, Text, HeartbeatLoader } from 'blockchain-info-components'
import {
  FooterShadowWrapper,
  FormGroup,
  FormItem,
  PhoneNumberBox,
  TextBox
} from 'components/Form'
import {
  Form,
  InputWrapper,
  PartnerHeader,
  PartnerSubHeader,
  EmailHelper
} from 'components/IdentityVerification'
import Terms from 'components/Terms'

const FormContainer = styled.div`
  margin-top: 25px;
  margin-bottom: 64px;
`
const PersonalForm = styled(Form)`
  height: 100%;
`
const FaqFormGroup = styled(FormGroup)`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const FaqFormItem = styled(FormItem)`
  width: 60%;
`
const Footer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const TermsText = styled(Text)`
  width: 50%;
  font-weight: 300px;
  font-size: 12px;
`
const { SMS_NUMBER_FORM, SMS_STEPS } = model.components.identityVerification

const smsHelper = ({ mobileVerifiedError, resendCode }) => {
  if (mobileVerifiedError) {
    return (
      <FormattedMessage
        id='identityverification.personal.sms.error'
        defaultMessage="That code doesn't match. {resend}."
        values={{
          resend: <a onClick={resendCode}>Resend a new code</a>
        }}
      />
    )
  }
  return (
    <FormattedMessage
      id='identityverification.personal.sms.didntreceive'
      defaultMessage="Didn't get our text? {resend}."
      values={{
        resend: <a onClick={resendCode}>Resend a new code</a>
      }}
    />
  )
}

const VerifyMobile = ({
  invalid,
  submitting,
  step,
  countryCode,
  smsNumber,
  mobileVerifiedError,
  editSmsNumber,
  updateSmsNumber,
  resendCode,
  handleSubmit
}) => (
  <PersonalForm onSubmit={handleSubmit}>
    <FooterShadowWrapper
      fields={
        <InputWrapper>
          <PartnerHeader>
            <FormattedMessage
              id='identityverification.personal.mobile.header'
              defaultMessage='Verify your Phone Number'
            />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage
              id='identityverification.personal.mobile.subheader'
              defaultMessage='Good news – you’re almost done! We need to confirm your phone number and get a copy of your photo ID. This will only take a few minutes.'
            />
          </PartnerSubHeader>
          <FormContainer>
            <FaqFormGroup>
              <FaqFormItem>
                <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
                  <FormattedMessage
                    id='identityverification.personal.mobile.entermobilenumber'
                    defaultMessage='Enter your mobile number here'
                  />
                </Text>
                <Field
                  name='smsNumber'
                  defaultValue={smsNumber}
                  component={PhoneNumberBox}
                  validate={[required, validMobileNumber]}
                  countryCode={countryCode}
                  onChange={editSmsNumber}
                  errorBottom
                />
              </FaqFormItem>
            </FaqFormGroup>
            {step === SMS_STEPS.edit && (
              <FaqFormGroup>
                <Button
                  nature='primary'
                  onClick={updateSmsNumber}
                  fullwidth
                  disabled={invalid}
                >
                  <FormattedMessage
                    id='identityverification.personal.mobile.sendmycode'
                    defaultMessage='Send My Code'
                  />
                </Button>
              </FaqFormGroup>
            )}
            {step === SMS_STEPS.verify && (
              <FaqFormGroup>
                <FaqFormItem>
                  <Text
                    size='14px'
                    weight={400}
                    style={{ marginBottom: '5px' }}
                  >
                    <FormattedMessage
                      id='identityverification.personal.mobile.entercode'
                      defaultMessage='Verification code'
                    />
                  </Text>
                  <Field
                    name='code'
                    component={TextBox}
                    validate={[required]}
                    errorBottom
                  />
                  <EmailHelper error={mobileVerifiedError}>
                    {smsHelper({
                      mobileVerifiedError,
                      resendCode
                    })}
                  </EmailHelper>
                </FaqFormItem>
              </FaqFormGroup>
            )}
          </FormContainer>
        </InputWrapper>
      }
      footer={
        <Footer>
          <TermsText>
            <Terms company='blockchain-kyc' />
          </TermsText>
          <Button
            uppercase
            nature='primary'
            type='submit'
            disabled={invalid || submitting || step !== SMS_STEPS.verify}
          >
            {!submitting ? (
              <FormattedMessage
                id='identityverification.personal.continue'
                defaultMessage='Continue'
              />
            ) : (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            )}
          </Button>
        </Footer>
      }
    />
  </PersonalForm>
)

VerifyMobile.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  step: PropTypes.string.isRequired,
  countryCode: PropTypes.object.isRequired,
  smsNumber: PropTypes.string.isRequired,
  mobileVerifiedError: PropTypes.string.isRequired,
  editSmsNumber: PropTypes.func.isRequired,
  updateSmsNumber: PropTypes.func.isRequired,
  resendCode: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: SMS_NUMBER_FORM
})(VerifyMobile)
