import React from 'react'

import BtcLockboxBalance from './BtcLockboxBalance'
import EthLockboxBalance from './EthLockboxBalance'
import BchLockboxBalance from './BchLockboxBalance'
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
        <Icon
          name='lock'
          size='21px'
          style={{ marginRight: '5px', marginLeft: '-5px' }}
        />
        <FormattedMessage
          id='layouts.wallet.menutop.balance.walletbalance.Lockbox'
          defaultMessage='Lockbox'
        />
      </HeaderText>
      <Icon
        name='caret'
        size='10px'
        className={props.isActive ? 'active' : ''}
      />
    </Header>
    <BalancesWrapper className={props.isActive ? 'active' : ''}>
      <BtcLockboxBalance />
      <EthLockboxBalance />
      <BchLockboxBalance />
    </BalancesWrapper>
  </Wrapper>
)

export default Template
