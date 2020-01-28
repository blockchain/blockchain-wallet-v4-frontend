import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Header, Wrapper } from 'components/Balances'
import { Icon, Text } from 'blockchain-info-components'

import { BalancesWrapper } from '../model'
import BchLockboxBalance from './BchLockboxBalance'
import BtcLockboxBalance from './BtcLockboxBalance'
import EthLockboxBalance from './EthLockboxBalance'
import XlmLockboxBalance from './XlmLockboxBalance'

const Title = styled(Text)`
  display: flex;
  flex-direction: row;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
`

const Template = props => (
  <Wrapper>
    <Header onClick={props.handleToggle} data-e2e='balanceDropdown-lockbox'>
      <Title>
        <Icon
          name='hardware'
          size='21px'
          style={{ marginRight: '16px', marginLeft: '0px' }}
        />
        <FormattedMessage
          id='layouts.wallet.menutop.balance.walletbalance.hardware'
          defaultMessage='Hardware'
        />
      </Title>
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
