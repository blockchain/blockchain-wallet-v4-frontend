import React from 'react'
import styled from 'styled-components'

import { NavLink } from 'components/Shared/Link'
import { Text } from 'components/Shared/Text'

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
  justify-content: center;
  align-items: center;
  width: 420px;
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
        {/*<Button type='primary' />*/}
        <LoginContainer>
          <Text id='scenes.landing.wallet.or' text='or' lighter uppercase />
          <NavLink to='/login' id='scenes.landing.wallet.login' text='Login' lighter uppercase cyan />
        </LoginContainer>
      </WalletContainer>
    </WalletWrapper>
  )
}

export default NewToBitcoin
