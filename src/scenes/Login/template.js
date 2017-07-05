import React from 'react'
import styled from 'styled-components'

import { Link, RouterLink } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Separator } from 'components/generic/Separator'

const LoginWrapper = styled.div`
  width: 100%;
  padding: 40px;
  background-color: #FFFFFF;

  & > * {
    padding-bottom: 10px;
  }

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
    <LoginWrapper>
      <Header>
        <Text id='scenes.login.welcome' text='Welcome back !' biggest light capitalize />
        <Aligned>
          <Text id='scenes.login.or' text='or' small light />
          <RouterLink id='scenes.login.register' text='Sign up' to='/register' small light cyan />
        </Aligned>
      </Header>
      <Text id='scenes.login.explain' text='Sign in to your wallet below' small light altFont />
      <Separator />
      <Text id='scenes.login.uid' text='Wallet ID' small medium />
      <Aligned>
        <Text id='scenes.login.info' text='Find the login link in your email, ' small altFont />
        <Text id='scenes.login.info2' text='e.g. blockchain.info/wallet/1111-222-333...' small altFont italic />
        <Text id='scenes.login.info3' text='The series of numbers and dashes at the end of the link is your Wallet ID.' small altFont />
      </Aligned>
      <Text id='scenes.login.password' text='Password' small medium />
      <Footer>
        <Link id='scenes.login.loginmobile' text='Login via mobile' small light cyan />
        <Aligned>
          <Text id='scenes.login.troubles' text='Having some troubles?' small light />
          <Text id='scenes.login.options' text='View options' small light cyan />
        </Aligned>
      </Footer>
    </LoginWrapper>
  )
}

export default Login
