import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'

import { required, validEmail, validWalletId } from 'services/FormHelper'
import { Button, Link, Separator, Text, TextGroup } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, FormLabel, TextBox } from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media(min-width: 768px) { width: 550px; }
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const FirstStepForm = styled(Form)`
  margin-top: 15px;
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

const FirstStep = (props) => {
  const { submitting, invalid, onSubmit } = props

  return (
    <Wrapper>
      <Header>
        <Text size='24px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.firststep.reset' defaultMessage='Reset 2FA' />
        </Text>
        <Text size='10px'>
          <FormattedMessage id='scenes.reset2fa.firststep.step1' defaultMessage='Step 1 of 3' />
        </Text>
      </Header>
      <Separator />
      <TextGroup>
        <Text size='13px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.firststep.explain' defaultMessage='Fill out the form below to regain access to your wallet by resetting your 2FA, restricted IP, and verified email.' />
        </Text>
        <Text size='13px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.firststep.explain2' defaultMessage='Note: Your IP address and browser information will be recorded upon submission.' />
        </Text>
      </TextGroup>
      <FirstStepForm onSubmit={onSubmit}>
        <FormGroup>
          <FormItem>
            <FormLabel for='guid'>
              <FormattedMessage id='scenes.reset2fa.firststep.firststepform.guid' defaultMessage='Wallet Identifier' />
            </FormLabel>
            <Field name='guid' autoFocus validate={[required, validWalletId]} component={TextBox} placeholder='XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX' />
            <TextGroup inline>
              <Text size='12px' weight={300}>
                <FormattedMessage id='scenes.reset2fa.firststep.firststepform.guidexplain' defaultMessage='If you forgot your wallet identifier, please' />
              </Text>
              <LinkContainer to='/reminder'>
                <Link size='12px' weight={300}>
                  <FormattedMessage id='scenes.reset2fa.firststep.look' defaultMessage='look it up here.' />
                </Link>
              </LinkContainer>
            </TextGroup>
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <FormLabel for='email'>
              <FormattedMessage id='scenes.reset2fa.firststep.firststepform.email' defaultMessage='Registered Email' />
            </FormLabel>
            <Field name='email' validate={[required, validEmail]} component={TextBox} />
            <Text size='12px' weight={300}>
              <FormattedMessage id='scenes.reset2fa.firststep.firststepform.emailexplain' defaultMessage="Enter the email associated with your wallet (even if you've lost access to it)." />
            </Text>
          </FormItem>
        </FormGroup>
        <Footer>
          <GoBackLink to='/help'>
            <Link size='13px' weight={300}>
              <FormattedMessage id='scenes.reset2fa.firststep.back' defaultMessage='Go Back' />
            </Link>
          </GoBackLink>
          <Button type='submit' nature='primary' uppercase disabled={submitting || invalid} >
            <FormattedMessage id='scenes.reset2fa.firststep.firststepform.continue' defaultMessage='Continue' />
          </Button>
        </Footer>
      </FirstStepForm>
    </Wrapper>
  )
}

export default reduxForm({ form: 'reset2FA', destroyOnUnmount: false })(FirstStep)
