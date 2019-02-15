import React from 'react'
import BtcBalance from './BtcBalance'
import EthBalance from './EthBalance'
import BchBalance from './BchBalance'
import XlmBalance from './XlmBalance'
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
      <BtcBalance />
      <EthBalance />
      <BchBalance />
      <XlmBalance />
    </BalancesWrapper>
  </Wrapper>
)

export default Template
