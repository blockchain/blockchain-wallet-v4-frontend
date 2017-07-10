import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { required, validEmail, validWalletId } from 'services/FormHelper'
import { SecondaryButton } from 'components/generic/Button'
import { Form, TextBox, HelpBlock } from 'components/generic/Form'
import { Link, RouterLink } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Separator } from 'components/generic/Separator'

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
  const { handleClickStep1, submitting, invalid } = props

  return (
    <Wrapper>
      <Header>
        <Text id='scenes.reset2fa.firststep.reset' text='Reset 2FA' biggest light capitalize />
        <Text id='scenes.reset2fa.firststep.step1' text='Step 1 of 3' smallest />
      </Header>
      <Text id='scenes.reset2fa.firststep.explain' text='Are you unable to gain access to your wallet because you lost your two factor authentication (2FA) device or are unable to access your email account ?' small light altFont />
      <br />
      <Text id='scenes.reset2fa.firststep.explain2' text='2FA reset requests are automatically approved after a certain time.' small light altFont />
      <Text id='scenes.reset2fa.firststep.explain3' text='Your IP address and browser information will be recorded on submission.' small light altFont />
      <Separator />
      <Form>
        <Text id='scenes.reset2fa.firststep.firststepform.guid' text='Wallet identifier' small medium capitalize />
        <Field name='guid' validate={[required, validWalletId]} component={TextBox} placeholder='XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX' />
        <HelpBlock>
          <Text id='scenes.reset2fa.firststep.firststepform.guid_explain' text='If you forgot your wallet identifier, please ' small light altFont />
          <RouterLink to='/reminder'><Text id='scenes.reset2fa.2fafirstform.look' text='look it up here' small light altFont cyan /></RouterLink>
        </HelpBlock>
        <Text id='scenes.reset2fa.firststep.firststepform.email' text='Registered email' small medium capitalize />
        <Field name='email' validate={[required, validEmail]} component={TextBox} />
        <HelpBlock>
          <Text id='scenes.reset2fa.firststep.firststepform.email_explain' text='Enter the email associated with your wallet.' small light altFont />
          <Text id='scenes.reset2fa.firststep.firststepform.email_explain2' text='If you lost access to this email, please enter it regardless.' small light altFont />
        </HelpBlock>
        <SecondaryButton id='scenes.reset2fa.firststep.firststepform.continue' text='Continue' disabled={submitting || invalid} onClick={handleClickStep1} fullwidth uppercase />
      </Form>
      <Footer>
        <RouterLink to='/help'><Text id='scenes.reset2fa.firststep.back' text='Go back' small light cyan /></RouterLink>
      </Footer>
    </Wrapper>
  )
}

export default reduxForm({ form: 'reset2FAForm1' })(FirstStep)
