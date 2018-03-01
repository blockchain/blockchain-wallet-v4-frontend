import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { TextBox, Form } from 'components/Form'
import { Text, Button, Icon } from 'blockchain-info-components'
import { required } from 'services/FormHelper'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`
const ColLeft = styled.div`
  width: 40%;
`
const ColRight = styled.div`
  width: 60%;
`
const ColLeftInner = styled.div`
  width: 80%;
`
const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 20px;
`
const Subtitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 15px;
`
const InputWrapper = styled.div`
  width: 55%;
  padding: 0px 15px;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
`
const FieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 275px;
`
const VerifiedWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
`
const AcceptTerms = styled.div`
  margin: 25px 0px;
  padding: 0px 15px;
  display: flex;
  flex-direction: row;
`
const TermsText = styled.span`
  a {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
  }
`
const ButtonWrapper = styled.div`
  margin: 0px 15px;
`
const CheckWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 5px;
`

const Create = (props) => {
  const { handleSubmit, emailVerification, smsVerified } = props
  const emailVerified = emailVerification === 1
  const mobileVerified = smsVerified === 1
  console.log('verified', emailVerified, mobileVerified)
  return (
    <Row>
      <ColLeft>
        <ColLeftInner>
          <Title>
            <FormattedMessage id='sfoxexchangedata.verify.title' defaultMessage='Create Your SFOX Account' />
          </Title>
          <Subtitle>
            <FormattedMessage id='sfoxexchangedata.verify.subtitle' defaultMessage='Accept Terms & Conditions to create your SFOX account.' />
          </Subtitle>
        </ColLeftInner>
      </ColLeft>
      <ColRight>
        <Form onSubmit={handleSubmit}>
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
            <Text>
              Phone Number
            </Text>
            <FieldWrapper>
              <Field name='phone' component={TextBox} validate={[required]} />
              {
                mobileVerified
                  ? <VerifiedWrapper>
                    <Icon size='26px' name='checkmark-in-circle' />
                  </VerifiedWrapper>
                  : null
              }
            </FieldWrapper>
          </InputWrapper>
          <AcceptTerms>
            <CheckWrapper>
              <input type='checkbox'  />
            </CheckWrapper>
            <TermsText>
              I accept Blockchain's <a>Terms of Service</a>, SFOX's <a>Terms of Service</a> and SFOX's <a>Privary Policy</a>.
            </TermsText>
          </AcceptTerms>
          <ButtonWrapper>
            <Button nature='primary' fullwidth>
              Continue
            </Button>
          </ButtonWrapper>
        </Form>
      </ColRight>
    </Row>
  )
}

Create.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({ form: 'sfoxCreate' })(Create)
