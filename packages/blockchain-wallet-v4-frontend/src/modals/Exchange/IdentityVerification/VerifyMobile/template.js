import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import { model } from 'data'
import { required, validMobileNumber } from 'services/FormHelper'

import {
  BackButton,
  EmailHelper,
  FaqFormGroup,
  FaqFormMessage,
  Footer,
  IdentityVerificationForm,
  IdentityVerificationHeader,
  IdentityVerificationSubHeader,
  InputWrapper,
  Label
} from 'components/IdentityVerification'
import {
  Button,
  HeartbeatLoader,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import {
  FooterShadowWrapper,
  FormItem,
  PhoneNumberBox,
  TextBox
} from 'components/Form'

const FormContainer = styled.div`
  margin-top: 25px;
  margin-bottom: 198px;
`
const ButtonFormItem = styled(FormItem)`
  display: flex;
  justify-content: flex-end;
`
const FaqHeaderHelper = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
`
const {
  SMS_NUMBER_FORM,
  SMS_STEPS,
  BAD_CODE_ERROR,
  PHONE_EXISTS_ERROR,
  UPDATE_FAILURE
} = model.components.identityVerification

const smsHelper = (error, resendCode) => {
  if (error === BAD_CODE_ERROR) {
    return (
      <FormattedMessage
        id='identityverification.personal.sms.badcode'
        defaultMessage="That code doesn't match. {resend}."
        values={{
          resend: <a onClick={resendCode}>Resend a new code</a>
        }}
      />
    )
  }
  if (error === PHONE_EXISTS_ERROR) {
    return (
      <FormattedMessage
        id='identityverification.personal.sms.numberexists'
        defaultMessage='This number is already in use.'
      />
    )
  }
  if (error === UPDATE_FAILURE) {
    return (
      <FormattedMessage
        id='identityverification.personal.sms.error'
        defaultMessage='Updating mobile number failed, please try again'
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
  error,
  step,
  activeField,
  activeFieldError,
  countryCode,
  smsNumber,
  editSmsNumber,
  updateSmsNumber,
  resendCode,
  handleSubmit,
  onBack
}) => (
  <IdentityVerificationForm
    activeFieldError={activeFieldError}
    activeField={activeField}
    onSubmit={handleSubmit}
  >
    <FooterShadowWrapper
      fields={
        <MediaContextConsumer>
          {({ mobile, tablet }) => (
            <InputWrapper>
              <IdentityVerificationHeader>
                <FormattedMessage
                  id='identityverification.personal.mobile.header'
                  defaultMessage='Verify your Phone Number'
                />
                <FaqHeaderHelper>
                  <TooltipHost id='identityverification.headerhelper'>
                    <TooltipIcon
                      name='question-in-circle-filled'
                      color='blue900'
                      size='24px'
                    />
                  </TooltipHost>
                </FaqHeaderHelper>
              </IdentityVerificationHeader>
              <IdentityVerificationSubHeader>
                <FormattedMessage
                  id='identityverification.personal.mobile.subheader'
                  defaultMessage='We need to verify your mobile number. This will help us to verify your identity today, and also keep your account secure in the future. To do this an SMS will be sent to your phone, with a verification code.'
                />
              </IdentityVerificationSubHeader>
              <FormContainer>
                <FaqFormGroup>
                  <FormItem>
                    <Label HtmlFor='smsNumber'>
                      <FormattedMessage
                        id='identityverification.personal.mobile.entermobilenumber'
                        defaultMessage='Enter your mobile number here'
                      />
                    </Label>
                    <Field
                      name='smsNumber'
                      defaultValue={smsNumber}
                      component={PhoneNumberBox}
                      validate={[required, validMobileNumber]}
                      countryCode={countryCode}
                      onChange={editSmsNumber}
                      errorBottom
                    />
                  </FormItem>
                  {activeField === 'smsNumber' && !mobile && !tablet && (
                    <FaqFormMessage
                      icon='phone-regular'
                      title={
                        <FormattedMessage
                          id='identityverification.mobile.faq.phone.title'
                          defaultMessage='Please add your phone'
                        />
                      }
                      text={
                        <FormattedMessage
                          id='identityverification.mobile.faq.phone.text'
                          defaultMessage='We will send you a SMS with verification code.'
                        />
                      }
                    />
                  )}
                </FaqFormGroup>
                {step === SMS_STEPS.edit && (
                  <FaqFormGroup>
                    <ButtonFormItem>
                      <Button
                        nature='primary'
                        onClick={updateSmsNumber}
                        disabled={invalid}
                      >
                        <FormattedMessage
                          id='identityverification.personal.mobile.sendmycode'
                          defaultMessage='Send My Code'
                        />
                      </Button>
                    </ButtonFormItem>
                  </FaqFormGroup>
                )}
                {step === SMS_STEPS.verify && (
                  <FaqFormGroup>
                    <FormItem>
                      <Label HtmlFor='code'>
                        <FormattedMessage
                          id='identityverification.personal.mobile.entercode.verification_code'
                          defaultMessage='Verification code'
                        />
                      </Label>
                      <Field
                        name='code'
                        component={TextBox}
                        validate={[required]}
                        errorBottom
                      />
                      <EmailHelper error={error}>
                        {smsHelper(error, resendCode)}
                      </EmailHelper>
                    </FormItem>
                    {activeField === 'code' && !mobile && !tablet && (
                      <FaqFormMessage
                        icon='comment-alt-regular'
                        title={
                          <FormattedMessage
                            id='identityverification.mobile.faq.code.title'
                            defaultMessage='We sent you a text message'
                          />
                        }
                        text={
                          <FormattedMessage
                            id='identityverification.mobile.faq.code.text'
                            defaultMessage='Your verification code is on its way. Once you receive it, please enter it.'
                          />
                        }
                      />
                    )}
                  </FaqFormGroup>
                )}
              </FormContainer>
            </InputWrapper>
          )}
        </MediaContextConsumer>
      }
      footer={
        <Footer>
          <BackButton onClick={onBack} disabled={submitting}>
            <FormattedMessage id='buttons.back' defaultMessage='Back' />
          </BackButton>
          <Button
            nature='primary'
            type='submit'
            disabled={invalid || submitting || step !== SMS_STEPS.verify}
          >
            {!submitting ? (
              <FormattedMessage
                id='buttons.continue'
                defaultMessage='Continue'
              />
            ) : (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            )}
          </Button>
        </Footer>
      }
    />
  </IdentityVerificationForm>
)

VerifyMobile.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  step: PropTypes.string.isRequired,
  countryCode: PropTypes.object.isRequired,
  smsNumber: PropTypes.string.isRequired,
  editSmsNumber: PropTypes.func.isRequired,
  updateSmsNumber: PropTypes.func.isRequired,
  resendCode: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: SMS_NUMBER_FORM
})(VerifyMobile)
