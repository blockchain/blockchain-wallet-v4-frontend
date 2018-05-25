import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import Helper from 'components/BuySell/FAQ'
import { CheckBox } from 'components/Form'
import { Button, HeartbeatLoader, Link, Text, TextGroup } from 'blockchain-info-components'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ButtonWrapper, ErrorWrapper, ColRightInner } from 'components/BuySell/Signup'

const AcceptTermsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 25px;
  font-size: 12px;
  a {
    color: ${props => props.theme['brand-secondary']}
  }
  * { cursor: pointer; }
`

const AcceptTerms = (props) => {
  const { busy, email, invalid, onSubmit, signupError, updateUI } = props

  const checkboxShouldBeChecked = value => value ? undefined : 'You must agree to the terms and conditions'

  const helpers = [
    {
      question: <FormattedMessage id='coinifysignup.create.helper1.question' defaultMessage='What is Coinify?' />,
      answer: <FormattedMessage id='coinifysignup.create.helper1.answer' defaultMessage='Answer placeholder' />
    }
  ]

  const faqHelper = () => helpers.map((el, i) => <Helper key={i} question={el.question} answer={el.answer} />)

  return (
    <Form onSubmit={onSubmit}>
      <ColLeft>
        <InputWrapper>
          <PartnerHeader>
            <FormattedMessage id='coinifyexchangedata.create.verifyemail.partner.header.createyouraccount' defaultMessage='Create Your Account' />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage id='coinifyexchangedata.create.accept.partner.header.enter_email_code' defaultMessage='We teamed up with Coinify’s exchange platform to offer buy and sell to our customers in Europe. We just sent a verification code to your {email} email address.' values={{ email: email }} />
          </PartnerSubHeader>
          <AcceptTermsContainer>
            <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
              <TextGroup inline>
                <Text size='12px' weight={300}>
                  <FormattedMessage id='coinifyexchangedata.create.accept.terms1' defaultMessage="I accept Blockchain's " />
                </Text>
                <Link href='https://www.blockchain.com/terms/index.html' target='_blank' referrer='noreferrer' size='12px' weight={300}>
                  <FormattedMessage id='coinifyexchangedata.create.accept.terms2' defaultMessage='Terms of Service ' />
                </Link>
                <Text size='12px' weight={300}>
                  Coinify's
                </Text>
                <Link href='https://coinify.com/legal/' target='_blank' referrer='noreferrer' size='12px' weight={300}>
                  <FormattedMessage id='coinifyexchangedata.create.accept.terms3' defaultMessage='Terms of Service' />
                </Link>
                <Text size='12px' weight={300}>
                  <FormattedMessage id='coinifyexchangedata.create.accept.terms4' defaultMessage=' &' />
                </Text>
                <Link href='https://coinify.com/legal/' target='_blank' referrer='noreferrer' size='12px' weight={300}>
                  <FormattedMessage id='coinifyexchangedata.create.accept.terms5' defaultMessage='Privacy Policy.' />
                </Link>
              </TextGroup>
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
              signupError && <TextGroup inline>
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
            }
          </ErrorWrapper>
          {faqHelper()}
        </ColRightInner>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'coinifyAcceptTerms' })(AcceptTerms)
