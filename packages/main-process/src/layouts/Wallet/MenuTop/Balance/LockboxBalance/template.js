import React from 'react'

import BtcLockboxBalance from './BtcLockboxBalance'
import EthLockboxBalance from './EthLockboxBalance'
import BchLockboxBalance from './BchLockboxBalance'
import XlmLockboxBalance from './XlmLockboxBalance'
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
    <Header onClick={props.handleToggle} data-e2e='balanceDropdown-lockbox'>
      <HeaderText size='14px'>
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
      <XlmLockboxBalance />
    </BalancesWrapper>
  </Wrapper>
)

export default Template
