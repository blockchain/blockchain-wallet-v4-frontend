import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import renderFaq from 'components/FaqDropdown'
import { CheckBox } from 'components/Form'
import Terms from 'components/Terms'
import {
  Button,
  HeartbeatLoader,
  Text,
  TextGroup,
  Link,
  Icon
} from 'blockchain-info-components'
import {
  Form,
  ColLeft,
  ColRight,
  InputWrapper,
  PartnerHeader,
  PartnerSubHeader,
  FieldMimic,
  ButtonWrapper,
  ErrorWrapper,
  ColRightInner
} from 'components/IdentityVerification'
import { prop } from 'ramda'
import media from 'services/ResponsiveService'

const AcceptTermsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 25px;
  font-size: 12px;
  a {
    color: ${props => props.theme['brand-secondary']};
    text-decoration: none;
  }
  * {
    cursor: pointer;
  }
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  ${media.mobile`
    margin-top: 10px;
  `};
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
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`
const AcceptTermsForm = styled(Form)`
  ${media.mobile`
    flex-direction: column;
  `};
`
const EditLink = styled(Link)`
  font-size: 12px;
  ${media.mobile`
    margin-top: 5px;
    font-size: 12px;
  `};
`
const VerifiedText = styled(Text)`
  font-size: 14px;
  margin-bottom: 10px;
  ${media.mobile`
    margin-bottom: 5px;
  `};
`
const checkboxShouldBeChecked = value =>
  value ? undefined : 'You must agree to the terms and conditions'

const faqQuestions = [
  {
    question: (
      <FormattedMessage
        id='coinifysignup.acceptterms.helper1.question'
        defaultMessage='What is Coinify?'
      />
    ),
    answer: (
      <FormattedMessage
        id='coinifysignup.acceptterms.helper1.answer'
        defaultMessage='Coinify is a trading platform we’ve partnered with to bring you a harmonious buy & sell experience in your Blockchain wallet'
      />
    )
  }
]

const AcceptTerms = props => {
  const {
    busy,
    email,
    invalid,
    handleSubmit,
    signupError,
    updateUI,
    emailVerified,
    editEmail,
    clearError
  } = props

  return (
    <AcceptTermsForm onSubmit={handleSubmit}>
      <ColLeft>
        <InputWrapper>
          <PartnerHeader>
            <FormattedMessage
              id='coinifyexchangedata.create.verifyemail.partner.header.createyouraccount'
              defaultMessage='Create Your Account'
            />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage
              id='coinifyexchangedata.create.accept.partner.header.acceptterms'
              defaultMessage='We teamed up with Coinify’s exchange platform to offer buy and sell to our customers in Europe. Accept their terms and conditions to start buying and selling.'
            />
          </PartnerSubHeader>
          <FieldsContainer>
            <FieldContainer>
              <VerifiedText>
                <FormattedMessage
                  id='sfoxexchangedata.create.createaccount.partner.verifiedemail'
                  defaultMessage='Verified Email Address'
                />
              </VerifiedText>
              <VerifiedContainer>
                <FieldMimic>
                  <Text size='14px' weight={300}>
                    {email}
                  </Text>
                  <EditLink onClick={editEmail} weight={300}>
                    {window.outerWidth > 480 ? (
                      <FormattedMessage
                        id='sfoxexchangedata.create.createaccount.partner.edit'
                        defaultMessage='edit'
                      />
                    ) : (
                      <FormattedMessage
                        id='sfoxexchangedata.create.createaccount.partner.editemail'
                        defaultMessage='edit email'
                      />
                    )}
                  </EditLink>
                </FieldMimic>
                <IconContainer>
                  {emailVerified ? (
                    <Icon
                      name='checkmark-in-circle-filled'
                      color='success'
                      size='20px'
                    />
                  ) : null}
                </IconContainer>
              </VerifiedContainer>
            </FieldContainer>
          </FieldsContainer>
          <AcceptTermsContainer>
            <Field
              name='terms'
              validate={[checkboxShouldBeChecked]}
              component={CheckBox}
            >
              <Terms company='coinify' />
            </Field>
          </AcceptTermsContainer>
        </InputWrapper>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <ButtonWrapper>
            <Button
              uppercase
              type='submit'
              nature='primary'
              fullwidth
              disabled={invalid || busy || signupError}
            >
              {!busy ? (
                <span>Continue</span>
              ) : (
                <HeartbeatLoader height='20px' width='20px' color='white' />
              )}
            </Button>
          </ButtonWrapper>
          <ErrorWrapper>
            {signupError &&
            prop('error', signupError) === 'email_address_in_use' ? (
              <TextGroup inline>
                <Text size='12px' color='error' weight={300}>
                  <FormattedMessage
                    id='coinifyexchangedata.create.accept.error1'
                    defaultMessage='Unfortunately this email is being used for another account. '
                  />
                </Text>
                <Text
                  size='12px'
                  color='brand-secondary'
                  cursor='pointer'
                  weight={300}
                  onClick={() => updateUI({ create: 'change_email' })}
                >
                  <FormattedMessage
                    id='coinifyexchangedata.create.accept.error2'
                    defaultMessage='Click here '
                  />
                </Text>
                <Text size='12px' color='error' weight={300}>
                  <FormattedMessage
                    id='coinifyexchangedata.create.accept.error3'
                    defaultMessage='to change it.'
                  />
                </Text>
              </TextGroup>
            ) : signupError ? (
              <TextGroup inline>
                <Text size='12px' color='error' weight={300}>
                  <FormattedMessage
                    id='coinifyexchangedata.create.accept.unknownError'
                    defaultMessage="We're sorry, but something unexpected went wrong. Please "
                  />
                </Text>
                <Link size='12px' weight={300} onClick={() => clearError()}>
                  <FormattedMessage id='tryagain' defaultMessage='try again' />
                </Link>
                <Text size='12px' color='error' weight={300}>
                  <FormattedMessage id='or' defaultMessage='or' />
                </Text>
                <Link
                  target='_blank'
                  href='https://support.blockchain.com'
                  size='12px'
                  weight={300}
                >
                  <FormattedMessage
                    id='contactsupport'
                    defaultMessage='contact support.'
                  />
                </Link>
              </TextGroup>
            ) : null}
          </ErrorWrapper>
          {renderFaq(faqQuestions)}
        </ColRightInner>
      </ColRight>
    </AcceptTermsForm>
  )
}

export default reduxForm({ form: 'coinifyAcceptTerms' })(AcceptTerms)
