import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'

const ExchangePill = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: ${props => props.theme.whiteFade100};
  padding: 12px 32px;
`

const ExchangeLogin = () => {
  return (
    <>
      <Link href='https://exchange.blockchain.com/trade/login'>
        <ExchangePill>
          <Icon name='blockchain-logo-circle' color='white' size='24px' />
          &nbsp; &nbsp;
          <Text size='16px' color='whiteFade600' weight={500}>
            <FormattedMessage
              id='scenes.login.wallet.exchange'
              defaultMessage='Looking for Exchange?'
            />
          </Text>
          &nbsp;
          <Text size='16px' color='whiteFade900' weight={600}>
            <FormattedMessage id='buttons.login' defaultMessage='Login' />
          </Text>
        </ExchangePill>
      </Link>
    </>
  )
}

export default ExchangeLogin
