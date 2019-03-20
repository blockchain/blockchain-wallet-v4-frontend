import React from 'react'
import Balance from './Balance'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import {
  Wrapper,
  BalancesWrapper,
  Header,
  HeaderText
} from 'components/Balances'

const Template = props => (
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
      <Balance coin='BTC' />
      <Balance coin='ETH' />
      <Balance coin='BCH' />
      <Balance coin='XLM' />
    </BalancesWrapper>
  </Wrapper>
)

export default Template
