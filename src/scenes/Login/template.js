import React from 'react'
import styled from 'styled-components'

import { Link, NavLink } from 'components/Shared/Link'
import { Text } from 'components/Shared/Text'
import { Separator } from 'components/Shared/Separator'

const LoginContainer = styled.div`
  width: 100%;
  padding: 40px;
  background-color: #FFFFFF;

  @media(min-width: 768px) { width: 600px; }
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const Row = styled.div`
  padding-bottom: 10px;
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
    <LoginContainer>
      {/*<Header>
        <Text id='scenes.login.welcome' text='Welcome back !' biggest light capitalize />
        <Aligned>
          <Text id='scenes.login.or' text='or' small light />
          <NavLink id='scenes.login.register' text='Sign up' to='/register' small light cyan />
        </Aligned>
      </Header>
      <Form>
      <Row>
        <Text id='scenes.login.explain' text='Sign in to your wallet below' small light altFont />
      </Row>
      <Separator />
      <Row>
        <Text id='scenes.login.uid' text='Wallet ID' small medium />
      </Row>
      <Row>
        <Input type='text' />
      </Row>
      <Row>
        <Aligned>
          <Text id='scenes.login.info' text='Find the login link in your email, ' small altFont />
          <Text id='scenes.login.info2' text='e.g. blockchain.info/wallet/1111-222-333...' small altFont italic />
          <Text id='scenes.login.info3' text='The series of numbers and dashes at the end of the link is your Wallet ID.' small altFont />
        </Aligned>
      </Row>
      <Row>
        <Text id='scenes.login.password' text='Password' small medium />
      </Row>
      <Row>
        <Input type='password' />
      </Row>
      <Row>
        
      </Row>
      <Footer>
        <Link id='scenes.login.loginmobile' text='Login via mobile' small light cyan />
        <Aligned>
          <Text id='scenes.login.troubles' text='Having some troubles?' small light />
          <Text id='scenes.login.options' text='View options' small light cyan />
        </Aligned>
      </Footer>*/}
    </LoginContainer>
  )
}

export default Login
