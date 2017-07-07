import React from 'react'
import styled from 'styled-components'

import { Link, RouterLink } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Separator } from 'components/generic/Separator'
import LoginForm from './LoginForm'

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
          <RouterLink to='/register'><Text id='scenes.login.register' text='Sign up' small light cyan /></RouterLink>
        </Aligned>
      </Header>
      <Text id='scenes.login.explain' text='Sign in to your wallet below' small light altFont />
      <Separator />
      <LoginForm handleClick={props.handleClick} handleTrezor={props.handleTrezor} />
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

export default Login
