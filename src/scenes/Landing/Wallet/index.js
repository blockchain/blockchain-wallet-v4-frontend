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
  background-color: ${props => props.theme['grey']};
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
        <Text size='24px' weight={200} uppercase>
          <FormattedMessage id='scenes.landing.wallet.get' defaultMessage="Get the world's most popular bitcoin wallet" />
        </Text>
        <LinkContainer to='/register'>
          <Button nature='secondary' rounded uppercase>
            <FormattedMessage id='scenes.landing.wallet.getstarted' defaultMessage='Get started now' />
          </Button>
        </LinkContainer>
        <LoginContainer>
          <Text size='14px' weight={300} uppercase>
            <FormattedMessage id='scenes.landing.wallet.or' defaultMessage='or' />
          </Text>
          <LinkContainer to='/login'>
            <Link size='14px' weight={300} uppercase>
              <FormattedMessage id='scenes.landing.wallet.login' defaultMessage='Login' />
            </Link>
          </LinkContainer>
        </LoginContainer>
      </WalletContainer>
    </WalletWrapper>
  )
}

export default NewToBitcoin
