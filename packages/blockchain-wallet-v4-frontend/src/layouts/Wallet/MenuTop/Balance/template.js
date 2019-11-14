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
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  @media (min-width: 850px) {
    align-items: center;
  }
`
const BalanceText = styled(Text)`
  margin-right: 8px;
  font-size: 14px;
  @media (max-width: 767px) {
    font-size: 14px;
  }
`
const BalanceDropdown = styled.div`
  margin: -2px -10px 0 0;
  > div > ul {
    right: 8px;
    padding: 0;
    position: absolute;
  }
  > div > div > div > div {
    font-weight: 400;
    color: ${props => props.theme['brand-primary']};
  }
  > div > div > span:last-child {
    top: 0;
    right: 14px;
    font-size: 9px;
    font-weight: 600;
    position: relative;
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

const Success = props => {
  const { coinOrRoute, supportedCoins } = props
  return (
    <Wrapper>
      <BalanceText weight={500} data-e2e='totalBalance' color='gray-3'>
        {getBalanceMessage(coinOrRoute, supportedCoins)}
      </BalanceText>
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

export default Success
