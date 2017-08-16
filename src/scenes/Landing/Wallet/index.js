import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { RouterLink, SecondaryButton, Text } from 'blockchain-info-components'

const WalletWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;  
  background-color: #F5F7F9;
  height: 300px;
`
const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 420px;
  height: 180px;
  text-align: center;
`
const LoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80px;
`

const NewToBitcoin = (props) => {
  return (
    <WalletWrapper>
      <WalletContainer>
        <Text id='scenes.landing.wallet.get' text="Get the world's most popular bitcoin wallet" biggest lighter uppercase />
        <NavLink to='/register'>
          <SecondaryButton rounded>
            <Text id='scenes.landing.wallet.getstarted' text='Get started now' lighter uppercase white />
          </SecondaryButton>
        </NavLink>
        <LoginContainer>
          <Text id='scenes.landing.wallet.or' text='or' lighter uppercase />
          <RouterLink to='/login'><Text id='scenes.landing.wallet.login' text='Login' lighter uppercase cyan /></RouterLink>
        </LoginContainer>
      </WalletContainer>
    </WalletWrapper>
  )
}

export default NewToBitcoin
