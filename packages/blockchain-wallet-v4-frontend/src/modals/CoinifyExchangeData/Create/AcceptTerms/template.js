import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import Helper from 'components/BuySell/FAQ'
import { CheckBox } from 'components/Form'
import Terms from 'components/Terms'
import { Button, HeartbeatLoader, Text, TextGroup, Link, Icon } from 'blockchain-info-components'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ButtonWrapper, ErrorWrapper, ColRightInner } from 'components/BuySell/Signup'
import { spacing } from 'services/StyleService'
import { prop } from 'ramda'

const AcceptTermsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 25px;
  font-size: 12px;
  a {
    color: ${props => props.theme['brand-secondary']};
    text-decoration: none;
  }
  * { cursor: pointer; }
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  @media (max-width: 480px) {
    margin-top: 10px;
  }
`
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`
const VerifiedContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const FieldBox = styled.div`
  border: 1px solid #DDDDDD;
  padding: 5px 15px;
  display: flex;
  flex-direction: row;
  width: 85%;
  justify-content: space-between;
  @media (max-width: 480px) {
    border: none;
    width: 100%;
    padding: 0px;
    flex-direction: column;
  }
`
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`
const AcceptTermsForm = styled(Form)`
  @media (max-width: 480px) {
    flex-direction: column;
  }
`
const checkboxShouldBeChecked = value => value ? undefined : 'You must agree to the terms and conditions'

const AcceptTerms = (props) => {
  const { busy, email, invalid, handleSubmit, signupError, updateUI, emailVerified, editEmail, clearError } = props

  const helpers = [
    {
      question: <FormattedMessage id='coinifysignup.acceptterms.helper1.question' defaultMessage='What is Coinify?' />,
      answer: <FormattedMessage id='coinifysignup.acceptterms.helper1.answer' defaultMessage='Coinify is a trading platform we’ve partnered with to bring you a harmonious buy & sell experience in your Blockchain wallet' />
    }
  ]

  const faqHelper = () => helpers.map((el, i) => <Helper key={i} question={el.question} answer={el.answer} />)

  return (
    <AcceptTermsForm onSubmit={handleSubmit}>
      <ColLeft>
        <InputWrapper>
          <PartnerHeader>
            <FormattedMessage id='coinifyexchangedata.create.verifyemail.partner.header.createyouraccount' defaultMessage='Create Your Account' />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage id='coinifyexchangedata.create.accept.partner.header.acceptterms' defaultMessage='We teamed up with Coinify’s exchange platform to offer buy and sell to our customers in Europe. Accept their terms and conditions to start buying and selling.' />
          </PartnerSubHeader>
          <FieldsContainer>
            <FieldContainer>
              <Text size='14px' style={spacing('mb-10')}>
                <FormattedMessage id='sfoxexchangedata.create.createaccount.partner.verifiedemail' defaultMessage='Verified Email Address' />
              </Text>
              <VerifiedContainer>
                <FieldBox>
                  <Text size='14px' weight={300}>
                    { email }
                  </Text>
                  <Link onClick={editEmail} size='14px' weight={300}>
                    <FormattedMessage id='sfoxexchangedata.create.createaccount.partner.edit' defaultMessage='edit' />
                  </Link>
                </FieldBox>
                <IconContainer>
                  { emailVerified ? <Icon name='checkmark-in-circle-filled' color='success' size='20px' /> : null }
                </IconContainer>
              </VerifiedContainer>
            </FieldContainer>
          </FieldsContainer>
          <AcceptTermsContainer>
            <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
              <Terms company='coinify' />
            </Field>
          </AcceptTermsContainer>
        </InputWrapper>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <ButtonWrapper>
            <Button uppercase type='submit' nature='primary' fullwidth disabled={invalid || busy || signupError}>
              {
                !busy
                  ? <span>Continue</span>
                  : <HeartbeatLoader height='20px' width='20px' color='white' />
              }
            </Button>
          </ButtonWrapper>
          <ErrorWrapper>
            {
              signupError && prop('error', signupError) === 'email_address_in_use'
                ? <TextGroup inline>
                  <Text size='12px' color='error' weight={300}>
                    <FormattedMessage id='coinifyexchangedata.create.accept.error1' defaultMessage='Unfortunately this email is being used for another account. ' />
                  </Text>
                  <Text size='12px' color='brand-secondary' cursor='pointer' weight={300} onClick={() => updateUI({ create: 'change_email' })}>
                    <FormattedMessage id='coinifyexchangedata.create.accept.error2' defaultMessage='Click here ' />
                  </Text>
                  <Text size='12px' color='error' weight={300}>
                    <FormattedMessage id='coinifyexchangedata.create.accept.error3' defaultMessage='to change it.' />

                  </Text>
                </TextGroup>
                : signupError
                  ? <TextGroup inline>
                    <Text size='12px' color='error' weight={300}>
                      <FormattedMessage id='coinifyexchangedata.create.accept.unknownError' defaultMessage="We're sorry, but something unexpected went wrong. Please " />
                    </Text>
                    <Link size='12px' weight={300} onClick={() => clearError()}>
                      <FormattedMessage id='tryagain' defaultMessage='try again' />
                    </Link>
                    <Text size='12px' color='error' weight={300}>
                      <FormattedMessage id='or' defaultMessage='or' />
                    </Text>
                    <Link target='_blank' href='https://support.blockchain.com' size='12px' weight={300}>
                      <FormattedMessage id='contactsupport' defaultMessage='contact support.' />
                    </Link>
                  </TextGroup>
                  : null
            }
          </ErrorWrapper>
          {faqHelper()}
        </ColRightInner>
      </ColRight>
    </AcceptTermsForm>
  )
}

export default reduxForm({ form: 'coinifyAcceptTerms' })(AcceptTerms)
