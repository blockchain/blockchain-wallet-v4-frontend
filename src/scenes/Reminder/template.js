import React from 'react'
import styled from 'styled-components'

import { RouterLink } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Separator } from 'components/generic/Separator'
import ReminderForm from './ReminderForm'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sigin: border-box;
  background-color: #FFFFFF;

  @media(min-width: 768px) { width: 550px; }
`
const Footer = styled.div`
  padding: 5px 0;
`

const Login = (props) => {
  return (
    <Wrapper>
      <Text id='scenes.reminder.remind' text='Remind me' biggest light capitalize />
      <Text id='scenes.reminder.explain' text="Lost your Wallet Identifier? We'll send it to you via your email." small light altFont />
      <Separator />
      <ReminderForm handleClick={props.handleClick} timestamp={props.timestamp} />
      <Footer>
        <RouterLink to='/help'><Text id='scenes.reminder.back' text='Go back' small light cyan /></RouterLink>
      </Footer>
    </Wrapper>
  )
}

export default Login
