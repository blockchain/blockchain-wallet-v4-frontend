import { FormattedMessage } from 'react-intl'
import { map } from 'ramda'
import React from 'react'
import styled from 'styled-components'

import { Header, Wrapper } from 'components/Balances'
import { Icon, Text } from 'blockchain-info-components'

import { BalancesWrapper } from '../model'
import Balance from './Balance'

const Title = styled(Text)`
  display: flex;
  flex-direction: row;
  color: ${props => props.theme.grey800};
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
`

const Template = props => {
  const { supportedCoins } = props
  const coinOrder = [
    supportedCoins.PAX,
    supportedCoins.BTC,
    supportedCoins.ETH,
    supportedCoins.BCH,
    supportedCoins.XLM
  ]

  return (
    <Wrapper>
      <Header onClick={props.handleToggle} data-e2e='balanceDropdown-wallet'>
        <Title>
          <Icon
            color='grey400'
            name='wallet-filled'
            size='22px'
            style={{ marginRight: '14px' }}
          />
          <FormattedMessage
            id='layouts.wallet.menutop.balance.walletbalance.wallet'
            defaultMessage='Wallet'
          />
        </Title>
        <Icon
          color='grey600'
          name='caret'
          size='10px'
          className={props.isActive ? 'active' : ''}
        />
      </Header>
      <BalancesWrapper className={props.isActive ? 'active' : ''}>
        {map(
          coin =>
            coin.invited && (
              <Balance coin={coin.coinCode} coinTicker={coin.coinTicker} />
            ),
          coinOrder
        )}
      </BalancesWrapper>
    </Wrapper>
  )
}

export default Template
