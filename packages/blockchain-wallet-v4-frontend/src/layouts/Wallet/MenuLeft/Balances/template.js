import { equals, includes, keys, toUpper } from 'ramda'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { ComponentDropdown, Text } from 'blockchain-info-components'
import Balance from './WalletBalance/Balance'
import CurrencySwitch from './CurrencySwitch'
import LockboxBalance from './LockboxBalance'
import LockboxTotalBalance from './LockboxBalance/TotalBalance'
import PendingBalance from './PendingBalance'
import TotalBalance from './TotalBalance'
import WalletBalance from './WalletBalance'
import WatchOnlyBalance from './WatchOnlyBalance'

const Wrapper = styled.div`
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
    right: -98px;
    top: 28px;
    padding: 0;
    width: 240px;
  }
  > div > div > div > div {
    color: ${props => props.theme.black};
    font-weight: 600;
    font-size: 24px;
    line-height: 135%;
  }
  > div > div > span:last-child {
    position: relative;
    top: -10px;
    right: -85px;
    font-size: 30px;
    font-weight: 600;
    color: ${props => props.theme.blue600};
    border: 1px solid ${props => props.theme.grey100};
    border-radius: 5px;
    padding-left: 0 !important;
  }
`

const getSelectedComponent = (coinOrRoute, supportedCoins) => {
  switch (true) {
    case equals(coinOrRoute, 'LOCKBOX'):
      return <LockboxTotalBalance />
    case includes(toUpper(coinOrRoute), keys(supportedCoins)):
      return <Balance large coin={toUpper(coinOrRoute)} />
    default:
      return <TotalBalance large />
  }
}

const getBalanceMessage = (coinOrRoute, supportedCoins) => {
  switch (true) {
    case equals(coinOrRoute, 'LOCKBOX'):
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.lockboxbalance'
          defaultMessage='Lockbox Balance'
        />
      )
    case includes(toUpper(coinOrRoute), keys(supportedCoins)):
      return (
        <FormattedHTMLMessage
          id='scenes.wallet.menutop.balance.balance'
          defaultMessage='{coin} Balance'
          values={{ coin: supportedCoins[toUpper(coinOrRoute)].displayName }}
        />
      )
    default:
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.totalbalance'
          defaultMessage='Total Balance'
        />
      )
  }
}

const Balances = props => {
  const { coinOrRoute, supportedCoins } = props
  return (
    <Wrapper>
      <TitleText data-e2e='totalBalance'>
        {getBalanceMessage(coinOrRoute, supportedCoins)}
      </TitleText>
      <BalanceDropdown>
        <ComponentDropdown
          down
          forceSelected
          toggleOnCallback={false}
          selectedComponent={getSelectedComponent(coinOrRoute, supportedCoins)}
          components={[
            <WalletBalance />,
            <LockboxBalance />,
            <PendingBalance />,
            <WatchOnlyBalance />,
            <CurrencySwitch />
          ]}
        />
      </BalanceDropdown>
    </Wrapper>
  )
}

export default Balances
