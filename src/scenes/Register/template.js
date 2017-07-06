import React from 'react'
import styled from 'styled-components'

import { RouterLink } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Separator } from 'components/generic/Separator'
import RegisterForm from './RegisterForm'

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
const Aligned = styled.div`
  & > * { display: inline-block; margin-right: 5px; }
`

const Register = (props) => {
  return (
    <Wrapper>
      <Header>
        <Text id='scenes.register.create' text='Create your Wallet' biggest light />
        <Aligned>
          <Text id='scenes.register.or' text='or' small light />
          <RouterLink to='/login'><Text id='scenes.register.login' text='Login' small light cyan /></RouterLink>
        </Aligned>
      </Header>
      <Text id='scenes.register.explain' text='Sign up for a free wallet below' small light altFont />
      <Separator />
      <RegisterForm submit={props.submit} submitFailed={props.submitFailed} />
    </Wrapper>
  )
}

export default Register
