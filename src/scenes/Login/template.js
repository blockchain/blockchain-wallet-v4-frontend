import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { PrimaryButton, SecondaryButton } from 'components/generic/Button'
import { Form, PasswordBox, TextBox, HelpBlock } from 'components/generic/Form'
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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px 0;

  @media(min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const Aligned = styled.div`
  & > * { display: inline-block; margin-right: 5px; }
`

const Login = (props) => {
  const { handleClick, handleTrezor, submitting, invalid } = props

  return (
    <Wrapper>
      <Header>
        <Text id='scenes.login.welcome' text='Welcome back !' biggest light capitalize />
        <Aligned>
          <Text id='scenes.login.or' text='or' small light />
          <RouterLink to='/register'><Text id='scenes.login.register' text='Sign up' small light cyan /></RouterLink>
        </Aligned>
      </Header>
      <Text id='scenes.login.explain' text='Sign in to your wallet below' small light altFont />
      <Separator />
      <Form>
        <Text id='scenes.login.guid' text='Wallet ID' small medium />
        <Field name='guid' validate={[required]} component={TextBox} />
        <HelpBlock>
          <Text id='scenes.login.info' text='Find the login link in your email, ' small altFont />
          <Text id='scenes.login.info2' text='e.g. blockchain.info/wallet/1111-222-333...' small altFont italic />
          <Text id='scenes.login.info3' text='The series of numbers and dashes at the end of the link is your Wallet ID.' small altFont />
        </HelpBlock>
        <Text id='scenes.login.password' text='Password' small medium />
        <Field name='password' validate={[required]} component={PasswordBox} />
        <SecondaryButton id='scenes.login.submit' text='Log in' disabled={submitting || invalid} onClick={handleClick} fullwidth uppercase />
        <PrimaryButton id='scenes.login.trezor' text='Trezor' onClick={handleTrezor} fullwidth uppercase />
      </Form>
      <Footer>
        <Link><Text id='scenes.login.loginmobile' text='Login via mobile' small light cyan /></Link>
        <Aligned>
          <Text id='scenes.login.troubles' text='Having some troubles?' small light />
          <RouterLink to='/help'><Text id='scenes.login.options' text='View options' small light cyan /></RouterLink>
        </Aligned>
      </Footer>
    </Wrapper>
  )
}

export default reduxForm({ form: 'loginForm' })(Login)
