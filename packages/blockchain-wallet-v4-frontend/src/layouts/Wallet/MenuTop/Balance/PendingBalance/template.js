import React from 'react'

import {
  BalancesWrapper,
  Header,
  HeaderText,
  Wrapper
} from 'components/Balances'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import SfoxPendingBalance from './SfoxPendingBalance'

const Template = props => (
  <Wrapper>
    <Header onClick={props.handleToggle}>
      <HeaderText size='14px'>
        <Icon name='pending' size='12px' style={{ marginRight: '10px' }} />
        <FormattedMessage
          id='layouts.wallet.menutop.balance.walletbalance.pending'
          defaultMessage='Pending'
        />
      </HeaderText>
      <Icon
        name='caret'
        size='10px'
        className={props.isActive ? 'active' : ''}
      />
    </Header>
    <BalancesWrapper className={props.isActive ? 'active' : ''}>
      <SfoxPendingBalance />
    </BalancesWrapper>
  </Wrapper>
)

export default Template
