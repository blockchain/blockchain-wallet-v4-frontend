import {
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'
import {
  ColLeft,
  ErrorWrapper,
  FieldMimic,
  Form,
  InputWrapper
} from 'components/IdentityVerification'
import { FormattedMessage } from 'react-intl'
import { model } from 'data'
import { prop } from 'ramda'
import { reduxForm } from 'redux-form'
import media from 'services/ResponsiveService'
import React, { Fragment } from 'react'
import styled from 'styled-components'

const { VERIFY } = model.components.coinify.REGISTER_STATES

export const EMAIL_IN_USE_ERROR = 'email_address_and_partner_id_in_use'

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  ${media.mobile`
    margin-top: 10px;
  `};
`
const VerifiedContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  > div {
    margin-left: 10px;
  }
`
export const AcceptTermsForm = styled(Form)`
  ${media.mobile`
    flex-direction: column;
  `};
`
const VerifiedText = styled(Text)`
  font-size: 14px;
  margin-bottom: 10px;
  ${media.mobile`
    margin-bottom: 5px;
  `};
`
const TermsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 36px;
`
const ErrorTextGroup = styled(TextGroup)`
  line-height: 14px;
`
export const TermsText = styled(Text)`
  width: 50%;
`
const SquaredButton = styled(Button)`
  border-radius: 0px;
`
const SentEmailText = styled(Text)`
  margin-top: 15px;
`
const WideInputWrapper = styled(InputWrapper)`
  width: 100%;
`

const AcceptTerms = props => {
  const {
    busy,
    email,
    invalid,
    handleSubmit,
    signupError,
    emailVerified,
    clearError,
    create,
    handleResend
  } = props
  return (
    <AcceptTermsForm onSubmit={handleSubmit}>
      <ColLeft>
        <WideInputWrapper>
          <FieldContainer>
            <VerifiedText>
              {emailVerified ? (
                <FormattedMessage
                  id='coinifyexchangedata.create.createaccount.partner.email_verified'
                  defaultMessage='Verified Email'
                />
              ) : (
                <FormattedMessage
                  id='coinifyexchangedata.create.createaccount.partner.email_no_verify'
                  defaultMessage='Verify Email'
                />
              )}
            </VerifiedText>
            <VerifiedContainer>
              <FieldMimic width='100%'>
                <Text size='16px' color='grey800' weight={500}>
                  {email}
                </Text>
              </FieldMimic>
              {create === VERIFY ? (
                <SquaredButton nature='primary' onClick={handleResend}>
                  <FormattedMessage
                    id='coinifyexchangedata.create.createaccount.partner.sendagain'
                    defaultMessage='Send Again'
                  />
                </SquaredButton>
              ) : null}
            </VerifiedContainer>
            {create === VERIFY ? (
              <SentEmailText size='14px' weight={400}>
                <FormattedMessage
                  id='coinifyexchangedata.create.createaccount.partner.checkyourinbox'
                  defaultMessage='Check your inbox. We just sent you an email.'
                />
              </SentEmailText>
            ) : null}
            <IconContainer>
              {emailVerified ? (
                <Fragment>
                  <Icon
                    name='checkmark'
                    color='success'
                    size='16px'
                    weight={600}
                  />
                  <Text color='success' size='14px' weight={600}>
                    <FormattedMessage
                      id='coinifyexchangedata.create.createaccount.partner.emailverified'
                      defaultMessage='Email Verified'
                    />
                  </Text>
                </Fragment>
              ) : null}
            </IconContainer>
            <TermsContainer>
              {emailVerified ? (
                <Fragment>
                  <TermsText size='12px' weight={400}>
                    <FormattedMessage
                      id='coinifyexchangedata.create.createaccount.partner.byclicking'
                      defaultMessage="By clicking continue, I agree to Coinify's {ToS} & {Privacy}"
                      values={{
                        ToS: (
                          <Link
                            href='https://www.coinify.com/legal'
                            size='12px'
                            weight={500}
                            rel='noreferrer noopener'
                            target='_blank'
                          >
                            Terms of Service
                          </Link>
                        ),
                        Privacy: (
                          <Link
                            href='https://www.coinify.com/legal/policy'
                            size='12px'
                            weight={500}
                            rel='noreferrer noopener'
                            target='_blank'
                          >
                            Privacy Policy
                          </Link>
                        )
                      }}
                    />
                  </TermsText>
                  <Button
                    nature='primary'
                    type='submit'
                    disabled={invalid || busy || signupError}
                  >
                    {!busy ? (
                      <Text color='white' size='14px' weight={600}>
                        <FormattedMessage
                          id='continue'
                          defaultMessage='Continue'
                        />
                      </Text>
                    ) : (
                      <HeartbeatLoader
                        height='20px'
                        width='20px'
                        color='white'
                      />
                    )}
                  </Button>
                </Fragment>
              ) : null}
            </TermsContainer>
            <ErrorWrapper>
              {prop('error', signupError) === EMAIL_IN_USE_ERROR &&
              create !== VERIFY ? (
                <ErrorTextGroup inline>
                  <Text size='12px' color='error' weight={500}>
                    <FormattedMessage
                      id='coinifyexchangedata.create.accept.err1'
                      defaultMessage='Unfortunately this email is being used for another account.'
                    />
                  </Text>
                  <Text
                    size='12px'
                    color='blue600'
                    cursor='pointer'
                    weight={600}
                    onClick={props.editEmail}
                  >
                    <FormattedMessage
                      id='coinifyexchangedata.create.accept.err2'
                      defaultMessage='Click here'
                    />
                  </Text>
                  <Text size='12px' color='error' weight={500}>
                    <FormattedMessage
                      id='coinifyexchangedata.create.accept.err3'
                      defaultMessage='to change it.'
                    />
                  </Text>
                </ErrorTextGroup>
              ) : signupError && create !== VERIFY ? (
                <ErrorTextGroup inline>
                  <Text size='12px' color='error' weight={500}>
                    <FormattedMessage
                      id='coinifyexchangedata.create.accept.unknownError'
                      defaultMessage="We're sorry, but something unexpected went wrong. Please "
                    />
                  </Text>
                  <Link size='12px' weight={500} onClick={clearError}>
                    <FormattedMessage
                      id='tryagain'
                      defaultMessage='try again'
                    />
                  </Link>
                  <Text size='12px' color='error' weight={500}>
                    <FormattedMessage id='or' defaultMessage='or' />
                  </Text>
                  <Link
                    target='_blank'
                    href='https://support.blockchain.com'
                    size='12px'
                    weight={500}
                    rel='noreferrer noopener'
                  >
                    <FormattedMessage
                      id='contactsupport'
                      defaultMessage='contact support.'
                    />
                  </Link>
                  <br />
                  <Text size='12px' color='error' weight={500}>
                    <FormattedMessage
                      id='coinifyexchangedata.create.accept.support_error_description'
                      defaultMessage='Error Description: {errorDescription}'
                      values={{
                        errorDescription: prop('error_description', signupError)
                      }}
                    />
                  </Text>
                </ErrorTextGroup>
              ) : null}
            </ErrorWrapper>
          </FieldContainer>
        </WideInputWrapper>
      </ColLeft>
    </AcceptTermsForm>
  )
}

export default reduxForm({ form: 'coinifyAcceptTerms' })(AcceptTerms)
