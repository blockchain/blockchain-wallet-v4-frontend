import { FormattedMessage } from 'react-intl'
import { map } from 'ramda'
import React from 'react'

import {
  BalancesWrapper,
  Header,
  HeaderText,
  Wrapper
} from 'components/Balances'
import { Icon } from 'blockchain-info-components'
import Balance from './Balance'

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
        <HeaderText size='14px'>
          <Icon name='wallet' size='12px' style={{ marginRight: '10px' }} />
          <FormattedMessage
            id='layouts.wallet.menutop.balance.walletbalance.wallet'
            defaultMessage='Wallet'
          />
        </HeaderText>
        <Icon
          name='caret'
          size='10px'
          className={props.isActive ? 'active' : ''}
        />
      </Header>
      <BalancesWrapper className={props.isActive ? 'active' : ''}>
        {map(
          coin =>
            coin.invited && (
              <Balance
                coin={coin.coinCode}
                coinTicker={coin.coinTicker}
                key={coin.coinCode}
              />
            ),
          coinOrder
        )}
      </BalancesWrapper>
    </Wrapper>
  )
}

export default Template
