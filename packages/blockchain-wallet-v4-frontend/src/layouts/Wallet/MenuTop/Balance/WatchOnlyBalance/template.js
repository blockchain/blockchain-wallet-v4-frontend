import React from 'react'

import BtcWatchOnlyBalance from './BtcWatchOnlyBalance'
import BchWatchOnlyBalance from './BchWatchOnlyBalance'
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
        <Icon name='forbidden' size='12px' style={{ marginRight: '10px' }} />
        <FormattedMessage
          id='layouts.wallet.menutop.balance.walletbalance.nonspendable'
          defaultMessage='Non-Spendable'
        />
      </HeaderText>
      <Icon
        name='caret'
        size='10px'
        className={props.isActive ? 'active' : ''}
      />
    </Header>
    <BalancesWrapper items={2} className={props.isActive ? 'active' : ''}>
      <BtcWatchOnlyBalance />
      <BchWatchOnlyBalance />
    </BalancesWrapper>
  </Wrapper>
)

export default Template
