import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'

import { required, validEmail, validWalletId } from 'services/FormHelper'
import { Button, Link, Separator, Text, TextGroup } from 'blockchain-info-components'
import { Form, TextBox } from 'components/Form'

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
const Footer = styled.div`
  padding: 5px 0;
`

const FirstStep = (props) => {
  const { submitting, invalid, onSubmit } = props

  return (
    <Wrapper>
      <Header>
        <Text size='30px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.firststep.reset' defaultMessage='Reset 2FA' />
        </Text>
        <Text size='10px'>
          <FormattedMessage id='scenes.reset2fa.firststep.step1' defaultMessage='Step 1 of 3' />
        </Text>
      </Header>
      <TextGroup>
        <Text size='13px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.firststep.explain' defaultMessage='Are you unable to gain access to your wallet because you lost your two factor authentication (2FA) device or are unable to access your email account?' />
        </Text>
        <Text size='13px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.firststep.explain2' defaultMessage='2FA reset requests are automatically approved after a certain time. Your IP address and browser information will be recorded on submission.' />
        </Text>
      </TextGroup>
      <Separator />
      <Form onSubmit={onSubmit}>
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.reset2fa.firststep.firststepform.guid' defaultMessage='Wallet Identifier' />
        </Text>
        <Field name='guid' validate={[required, validWalletId]} component={TextBox} placeholder='XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX' />
        <TextGroup inline>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.reset2fa.firststep.firststepform.guid_explain' defaultMessage='If you forgot your wallet identifier, please' />
          </Text>
          <LinkContainer to='/reminder'>
            <Link size='13px' weight={300}>
              <FormattedMessage id='scenes.reset2fa.2fafirstform.look' defaultMessage='look it up here.' />
            </Link>
          </LinkContainer>
        </TextGroup>
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.reset2fa.firststep.firststepform.email' defaultMessage='Registered Email' />
        </Text>
        <Field name='email' validate={[required, validEmail]} component={TextBox} />
        <Text size='13px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.firststep.firststepform.email_explain' defaultMessage='Enter the email associated with your wallet. ' />
          <FormattedMessage id='scenes.reset2fa.firststep.firststepform.email_explain2' defaultMessage='If you lost access to this email, please enter it regardless.' />
        </Text>
        <Button type='submit' nature='primary' fullwidth uppercase disabled={submitting || invalid} >
          <FormattedMessage id='scenes.reset2fa.firststep.firststepform.continue' defaultMessage='Continue' />
        </Button>
      </Form>
      <Footer>
        <LinkContainer to='/help'>
          <Link size='13px' weight={300}>
            <FormattedMessage id='scenes.reset2fa.firststep.back' defaultMessage='Go Back' />
          </Link>
        </LinkContainer>
      </Footer>
    </Wrapper>
  )
}

export default reduxForm({ form: 'reset2FA', destroyOnUnmount: false })(FirstStep)
