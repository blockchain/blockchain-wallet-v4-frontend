import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { ComponentDropdown, Text } from 'blockchain-info-components'

import CurrencySwitch from './CurrencySwitch'
import LockboxBalance from './LockboxBalance'
import TotalBalance from './TotalBalance'
import WalletBalance from './WalletBalance'
import WatchOnlyBalance from './WatchOnlyBalance'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 6px 0 16px;
  padding-left: 16px;
`
const TitleText = styled(Text)`
  margin-right: 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.grey600};
  line-height: 150%;
`
const BalanceDropdown = styled.div`
  width: 100%;
  min-width: 100%;
  > div > ul {
    position: absolute;
    top: 28px;
    right: 12px;
    padding: 0;
    width: 230px;
  }
  > div > div {
    width: initial;
  }
  > div > div > div > div {
    color: ${props => props.theme.grey800};
    font-weight: 600;
    font-size: 24px;
    line-height: 135%;
  }
  > div > div > span:last-child {
    position: absolute;
    top: 0;
    right: 22px;
    font-size: 22px;
    color: ${props => props.theme.grey500};
    border: 1px solid ${props => props.theme.grey100};
    border-radius: 4px;
    padding: 0;
    &:hover {
      border: 1px solid ${props => props.theme.blue600};
      color: ${props => props.theme.blue600};
    }
  }
`

const BalancesContainer = () => (
  <Wrapper>
    <TitleText data-e2e='totalBalance'>
      <FormattedMessage
        id='scenes.wallet.menutop.balance.totalbalance'
        defaultMessage='Total Balance'
      />
    </TitleText>
    <BalanceDropdown>
      <ComponentDropdown
        down
        forceSelected
        toggleOnCallback={false}
        selectedComponent={<TotalBalance large />}
        components={[
          <WalletBalance />,
          <LockboxBalance />,
          <WatchOnlyBalance />,
          <CurrencySwitch />
        ]}
      />
    </BalanceDropdown>
  </Wrapper>
)

export default BalancesContainer
