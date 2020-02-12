import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Header, Wrapper } from 'components/Balances'

import { Icon, Text } from 'blockchain-info-components'
import BchWatchOnlyBalance from './Bch'
import BtcWatchOnlyBalance from './Btc'

import { BalancesWrapper } from '../model'

const Title = styled(Text)`
  display: flex;
  flex-direction: row;
  color: ${props => props.theme.grey800};
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
`

const Template = props => (
  <Wrapper>
    <Header onClick={props.handleToggle}>
      <Title>
        <Icon
          color='grey400'
          name='forbidden'
          size='18px'
          style={{ marginRight: '16px' }}
        />
        <FormattedMessage
          id='layouts.wallet.menutop.balance.walletbalance.nonspendable'
          defaultMessage='Non-Spendable'
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
      <BtcWatchOnlyBalance />
      <BchWatchOnlyBalance />
    </BalancesWrapper>
  </Wrapper>
)

export default Template
