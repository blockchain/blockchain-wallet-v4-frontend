import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types';
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
const CheckWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 5px;
`

const Create = (props) => {
  const { handleSignup, emailVerification, smsVerified, resendSMSCode, ui, smsNumber } = props
  const emailVerified = emailVerification === 1
  const mobileVerified = smsVerified === 1
  console.log('verified', emailVerified, mobileVerified)
  return (
    <Row>
      <ColumnLeft emailVerified={emailVerified} mobileVerified={mobileVerified} />
      <ColRight>
        <div>
          {
            emailVerified && mobileVerified
              ? <AcceptTerms handleSignup={handleSignup} />
              : !mobileVerified
                ? <VerifyMobile smsNumber={smsNumber} />
                : <VerifyEmail />
          }







          {/*
          <InputWrapper>
            <Text>
              Email Address
            </Text>
            <FieldWrapper>
              <Field name='email' component={TextBox} validate={[required]} />
              {
                emailVerified
                  ? <VerifiedWrapper>
                    <Icon size='26px' name='checkmark-in-circle' />
                  </VerifiedWrapper>
                  : null
              }
            </FieldWrapper>
          </InputWrapper>
          <InputWrapper>
            {
              mobileVerified
                ? <Text>
                  Phone Number
                </Text>
                : <Text>
                  Enter verification code sent to your mobile phone:
                </Text>
            }
            <FieldWrapper>
              <Field name='phone' component={TextBox} validate={[required]} />
              {
                mobileVerified
                  ? null
                  : <TermsText>
                    Didn't receive the code? { ui.smsCodeSent ? <a>Sent!</a> : <a onClick={resendSMSCode}>Resend</a> }
                  </TermsText>
              }
            </FieldWrapper>
            {
              mobileVerified
              ? <VerifiedWrapper>
                <Icon size='26px' name='checkmark-in-circle' />
              </VerifiedWrapper>
              : null
            }
          </InputWrapper>
          {
            mobileVerified && emailVerified
              ? <AcceptTerms>
                <CheckWrapper>
                  <input type='checkbox'  />
                </CheckWrapper>
                <TermsText>
                  I accept Blockchain's <a>Terms of Service</a>, SFOX's <a>Terms of Service</a> and SFOX's <a>Privary Policy</a>.
                </TermsText>
              </AcceptTerms>
              : null
          }
          <ButtonWrapper>
            <Button nature='primary' fullwidth>
              Continue
            </Button>
          </ButtonWrapper> */}
        </div>
      </ColRight>
    </Row>
  )
}

Create.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({ form: 'sfoxCreate' })(Create)
