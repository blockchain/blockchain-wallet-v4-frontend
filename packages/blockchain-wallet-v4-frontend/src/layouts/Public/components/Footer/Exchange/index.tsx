import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'

const ExchangeLoginRow = styled.div`
  display: flex;
`

const ExchangeLogin = () => (
  <Link data-e2e='exchangeLinkLogin' href='https://exchange.blockchain.com/trade/login'>
    <ExchangeLoginRow>
      <Text size='16px' color='grey400' weight={500} lineHeight='1.5'>
        <FormattedMessage
          id='scenes.login.wallet.exchange'
          defaultMessage='Looking for the Exchange?'
        />
      </Text>
      &nbsp;
      <Text size='16px' color='white' weight={600} lineHeight='1.5'>
        <FormattedMessage id='scenes.login.wallet.exchange_login' defaultMessage='Log In ->' />
      </Text>
    </ExchangeLoginRow>
  </Link>
)

export default ExchangeLogin
