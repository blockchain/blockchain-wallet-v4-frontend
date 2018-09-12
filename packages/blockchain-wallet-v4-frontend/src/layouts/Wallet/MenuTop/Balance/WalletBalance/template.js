import React from 'react'
import BtcBalance from './BtcBalance'
import EthBalance from './EthBalance'
import BchBalance from './BchBalance'
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
    <Header>
      <HeaderText size='14px' onClick={props.handleToggle}>
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
    <BalancesWrapper items={3} className={props.isActive ? 'active' : ''}>
      <BtcBalance />
      <EthBalance />
      <BchBalance />
    </BalancesWrapper>
  </Wrapper>
)

export default Template
