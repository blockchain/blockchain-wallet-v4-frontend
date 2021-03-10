import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Link, Text, TextGroup } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, FormLabel, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { required, validEmail, validWalletId } from 'services/forms'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`
const FirstStepForm = styled(Form)`
  margin-top: 15px;
`
const InfoMsg = styled(Text)`
  margin-top: 5px;
`
const Footer = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const GoBackLink = styled(LinkContainer)`
  margin-right: 15px;
`

const FirstStep = props => {
  const { handleSubmit, invalid, submitting } = props

  const validNullableEmail = emailVal => {
    return emailVal && emailVal.length ? validEmail(emailVal) : undefined
  }

  return (
    <Wrapper>
      <Header>
        <Text size='20px' color='blue900' weight={600} capitalize>
          <FormattedMessage
            id='scenes.reset2fa.firststep.reset'
            defaultMessage='Reset 2FA'
          />
        </Text>
      </Header>
      <TextGroup>
        <Text size='13px' weight={400}>
          <FormattedMessage
            id='scenes.reset2fa.firststep.explain'
            defaultMessage='Fill out the form below to regain access to your wallet by resetting your 2FA, restricted IP, and verified email.'
          />
        </Text>
        <Text size='13px' weight={400}>
          <FormattedMessage
            id='scenes.reset2fa.firststep.explain2'
            defaultMessage='Note: Your IP address and browser information will be recorded upon submission.'
          />
        </Text>
      </TextGroup>
      <FirstStepForm onSubmit={handleSubmit}>
        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='guid'>
              <FormattedMessage
                id='scenes.reset2fa.firststep.firststepform.walletid'
                defaultMessage='Wallet ID'
              />
            </FormLabel>
            <Field
              bgColor='grey000'
              autoFocus
              component={TextBox}
              disableSpellcheck
              name='guid'
              validate={[required, validWalletId]}
            />
            <TextGroup inline>
              <Text size='12px' weight={400}>
                <FormattedMessage
                  id='scenes.reset2fa.firststep.firststepform.guidexplain'
                  defaultMessage='If you forgot your wallet identifier, please'
                />
              </Text>
              <LinkContainer to='/reminder'>
                <Link size='12px' weight={500}>
                  <FormattedMessage
                    id='scenes.reset2fa.firststep.look'
                    defaultMessage='look it up here.'
                  />
                </Link>
              </LinkContainer>
            </TextGroup>
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='email'>
              <FormattedMessage
                id='scenes.reset2fa.firststep.firststepform.email'
                defaultMessage='Registered Email'
              />
            </FormLabel>
            <Field
              bgColor='grey000'
              name='email'
              validate={[required, validEmail]}
              component={TextBox}
            />
            <Text size='12px' weight={400}>
              <FormattedMessage
                id='scenes.reset2fa.firststep.firststepform.emailexplain'
                defaultMessage="Enter the email associated with your wallet (even if you've lost access to it)."
              />
            </Text>
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='newEmail'>
              <FormattedMessage
                id='scenes.reset2fa.firststep.newEmail'
                defaultMessage='New Email (Optional)'
              />
            </FormLabel>
            <Field
              bgColor='grey000'
              name='newEmail'
              validate={[validNullableEmail]}
              component={TextBox}
            />
            <InfoMsg size='12px' weight={400}>
              <FormattedMessage
                id='scenes.reset2fa.firststep.newEmailExplain'
                defaultMessage="Enter your updated email if you've lost access to your previously verified email. If your 2FA reset request if approved, this will automatically be set as your wallet's new email address."
              />
            </InfoMsg>
          </FormItem>
        </FormGroup>
        <Footer>
          <GoBackLink to='/help'>
            <Link size='13px' weight={500}>
              <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
            </Link>
          </GoBackLink>
          <Button
            type='submit'
            nature='primary'
            disabled={submitting || invalid}
          >
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Button>
        </Footer>
      </FirstStepForm>
    </Wrapper>
  )
}

export default reduxForm({ form: 'reset2FA', destroyOnUnmount: false })(
  FirstStep
)
