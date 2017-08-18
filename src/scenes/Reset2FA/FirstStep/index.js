import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { required, validEmail, validWalletId } from 'services/FormHelper'
import { Button, Separator, Text } from 'blockchain-info-components'
import { Form, HelpBlock, TextBox } from 'components/Form'
import RouterLink from 'components/RouterLink'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sigin: border-box;
  background-color: #FFFFFF;

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
  const { next, submitting, invalid } = props

  return (
    <Wrapper>
      <Header>
        <FormattedMessage id='scenes.reset2fa.firststep.reset' defaultMessage='Reset 2FA' />
        <Text size='10px'>
          <FormattedMessage id='scenes.reset2fa.firststep.step1' defaultMessage='Step 1 of 3' />
        </Text>
      </Header>
      <FormattedMessage id='scenes.reset2fa.firststep.explain' defaultMessage='Are you unable to gain access to your wallet because you lost your two factor authentication (2FA) device or are unable to access your email account ?' />
      <br />
      <FormattedMessage id='scenes.reset2fa.firststep.explain2' defaultMessage='2FA reset requests are automatically approved after a certain time.' />
      <FormattedMessage id='scenes.reset2fa.firststep.explain3' defaultMessage='Your IP address and browser information will be recorded on submission.' />
      <Separator />
      <Form>
        <FormattedMessage id='scenes.reset2fa.firststep.firststepform.guid' defaultMessage='Wallet identifier' />
        <Field name='guid' validate={[required, validWalletId]} component={TextBox} placeholder='XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX' />
        <HelpBlock>
          <FormattedMessage id='scenes.reset2fa.firststep.firststepform.guid_explain' defaultMessage='If you forgot your wallet identifier, please ' />
          <RouterLink to='/reminder'>
            <FormattedMessage id='scenes.reset2fa.2fafirstform.look' defaultMessage='look it up here' />
          </RouterLink>
        </HelpBlock>
        <FormattedMessage id='scenes.reset2fa.firststep.firststepform.email' defaultMessage='Registered email' />
        <Field name='email' validate={[required, validEmail]} component={TextBox} />
        <HelpBlock>
          <FormattedMessage id='scenes.reset2fa.firststep.firststepform.email_explain' defaultMessage='Enter the email associated with your wallet.' />
          <FormattedMessage id='scenes.reset2fa.firststep.firststepform.email_explain2' defaultMessage='If you lost access to this email, please enter it regardless.' />
        </HelpBlock>
        <Button nature='secondary' fullwidth uppercase disabled={submitting || invalid} onClick={next}>
          <FormattedMessage id='scenes.reset2fa.firststep.firststepform.continue' defaultMessage='Continue' />
        </Button>
      </Form>
      <Footer>
        <RouterLink to='/help'>
          <FormattedMessage id='scenes.reset2fa.firststep.back' defaultMessage='Go back' />
        </RouterLink>
      </Footer>
    </Wrapper>
  )
}

export default FirstStep
