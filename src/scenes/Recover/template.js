import React from 'react'
import styled from 'styled-components'

import { Link, RouterLink } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Separator } from 'components/generic/Separator'

import PassPhraseForm from './PassPhraseForm'
import WalletForm from './WalletForm'

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

const Login = (props) => {
  if (props.step === 1) {
    return (
      <Wrapper>
        <Header>
          <Text id='scenes.recover.funds' text='Recover funds' biggest light capitalize />
          <Text id='scenes.recover.step1' text='Step 1 of 2: Enter 12 word passphrase' smallest />
        </Header>
        <Text id='scenes.recover.explain' text='Recover bitcoins from your lost wallet' small light altFont />
        <Separator />
        <PassPhraseForm handleClickStep1={props.handleClickStep1} />
        <Footer>
          <RouterLink to='/help'><Text id='scenes.reminder.back' text='Go back' small light cyan /></RouterLink>
        </Footer>
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <Header>
          <Text id='scenes.recover.funds' text='Recover funds' biggest light capitalize />
          <Text id='scenes.recover.step2' text='Step 2 of 2: Create a new wallet' smallest />
        </Header>
        <Text id='scenes.recover.explain' text='Recover bitcoins from your lost wallet' small light altFont />
        <Separator />
        <WalletForm handleClickStep2={props.handleClickStep2} />
        <Footer>
          <Link onClick={props.handleGoBackStep2}><Text id='scenes.reminder.back' text='Go back' small light cyan /></Link>
        </Footer>
      </Wrapper>
    )
  }
}

export default Login
