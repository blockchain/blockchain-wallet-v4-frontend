import React from 'react'
import styled from 'styled-components'

import { SecondaryButton } from 'components/generic/Button'
import { Form, FormGroup, TextBox, PasswordBox, HelpBlock } from 'components/generic/Form'
import { Link, RouterLink } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Separator } from 'components/generic/Separator'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sigin: border-box;
  background-color: #FFFFFF;

  & > * { padding-bottom: 10px; }

  @media(min-width: 768px) { width: 600px; }
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const Aligned = styled.div`
  & > * { display: inline-block; margin-right: 5px; }
`

const Login = (props) => {
  return (
    <Wrapper>
      <Header>
        <Text id='scenes.login.welcome' text='Welcome back !' biggest light capitalize />
        <Aligned>
          <Text id='scenes.login.or' text='or' small light />
          <RouterLink to='/'><Text id='scenes.login.register' text='Sign up' to='/register' small light cyan /></RouterLink>
        </Aligned>
      </Header>
      <Text id='scenes.login.explain' text='Sign in to your wallet below' small light altFont />
      <Separator />
      <Form>
        <FormGroup id='guid' validationState={props.validation.guid} >
          <Text id='scenes.login.guid' text='Wallet ID' small medium />
          <TextBox name='guid' value={props.values.guid} onChange={props.onChange} />
          <HelpBlock>
            <Text id='scenes.login.info' text='Find the login link in your email, ' small altFont />
            <Text id='scenes.login.info2' text='e.g. blockchain.info/wallet/1111-222-333...' small altFont italic />
            <Text id='scenes.login.info3' text='The series of numbers and dashes at the end of the link is your Wallet ID.' small altFont />
          </HelpBlock>
        </FormGroup>
        <FormGroup id='password' validationState={props.validation.password}>
          <Text id='scenes.login.password' text='Password' small medium />
          <PasswordBox name='password' value={props.values.password} onChange={props.onChange} />
        </FormGroup>
        <SecondaryButton id='scenes.login.submit' text='Log in' small medium uppercase white onClick={props.onClick} />
        <SecondaryButton id='scenes.login.trezor' text='Trezor' small medium uppercase white onClick={props.onTrezor} />
      </Form>
      <Footer>
        <Link><Text id='scenes.login.loginmobile' text='Login via mobile' small light cyan /></Link>
        <Aligned>
          <Text id='scenes.login.troubles' text='Having some troubles?' small light />
          <RouterLink to='/'><Text id='scenes.login.options' text='View options' small light cyan /></RouterLink>
        </Aligned>
      </Footer>
    </Wrapper>
  )
}

export default Login
