import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Button, Link, Text } from 'blockchain-info-components'

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
        <Text uppercase>
          <FormattedMessage id='scenes.landing.wallet.get' defaultMessage="Get the world's most popular bitcoin wallet" />
        </Text>
        <LinkContainer to='/register'>
          <Button nature='secondary' rounded>
            <FormattedMessage id='scenes.landing.wallet.getstarted' defaultMessage='Get started now' />
          </Button>
        </LinkContainer>
        <LoginContainer>
          <FormattedMessage id='scenes.landing.wallet.or' defaultMessage='or' />
          <LinkContainer to='/login'>
            <Link>
              <FormattedMessage id='scenes.landing.wallet.login' defaultMessage='Login' />
            </Link>
          </LinkContainer>
        </LoginContainer>
      </WalletContainer>
    </WalletWrapper>
  )
}

export default NewToBitcoin
