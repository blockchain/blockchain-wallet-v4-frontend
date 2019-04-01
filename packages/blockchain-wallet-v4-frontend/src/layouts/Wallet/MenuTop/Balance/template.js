import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { equals, keys, includes, toUpper } from 'ramda'

import { model } from 'data'
import TotalBalance from './TotalBalance'
import WalletBalance from './WalletBalance'
import LockboxBalance from './LockboxBalance'
import LockboxTotalBalance from './LockboxBalance/TotalBalance'
import PendingBalance from './PendingBalance'
import WatchOnlyBalance from './WatchOnlyBalance'
import Balance from './WalletBalance/Balance'
import CurrencySwitch from './CurrencySwitch'
import { ComponentDropdown, Text } from 'blockchain-info-components'

const { COIN_MODELS } = model.coins
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  @media (min-width: 850px) {
    align-items: flex-end;
  }
`
const BalanceText = styled(Text)`
  margin-right: 4px;
  font-size: 18px;
  @media (max-width: 767px) {
    font-size: 14px;
  }
`
const BalanceDropdown = styled.div`
  margin: 4px -10px 0 0;
  > div > ul {
    right: 8px;
    padding: 0;
    position: absolute;
  }
  > div > div > div > div {
    font-weight: 300;
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

const getSelectedComponent = coinOrRoute => {
  switch (true) {
    case equals(coinOrRoute, 'LOCKBOX'):
      return <LockboxTotalBalance />
    case includes(toUpper(coinOrRoute), keys(COIN_MODELS)):
      return <Balance large coin={toUpper(coinOrRoute)} />
    default:
      return <TotalBalance large />
  }
}

const getBalanceMessage = coinOrRoute => {
  switch (true) {
    case equals(coinOrRoute, 'LOCKBOX'):
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.lockboxbalance'
          defaultMessage='Lockbox Balance'
        />
      )
    case includes(toUpper(coinOrRoute), keys(COIN_MODELS)):
      return (
        <FormattedHTMLMessage
          id='scenes.wallet.menutop.balance.balance'
          defaultMessage='{coin} Balance'
          values={{ coin: COIN_MODELS[toUpper(coinOrRoute)].displayName }}
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

const Success = props => (
  <Wrapper>
    <BalanceText weight={200} data-e2e='totalBalance' color='gray-3'>
      {getBalanceMessage(props.coinOrRoute)}
    </BalanceText>
    <BalanceDropdown>
      <ComponentDropdown
        down
        forceSelected
        toggleOnCallback={false}
        selectedComponent={getSelectedComponent(props.coinOrRoute)}
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

export default Success
