import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { includes } from 'ramda'

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

const { COIN_MODELS, SUPPORTED_COINS } = model.coins
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

const getSelectedComponent = coinOrLocation => {
  switch (true) {
    case includes(coinOrLocation, SUPPORTED_COINS):
      return <Balance large coin={coinOrLocation} />
    case coinOrLocation.includes('LOCKBOX'):
      return <LockboxTotalBalance />
    default:
      return <TotalBalance large />
  }
}

const getBalanceMessage = coinOrLocation => {
  switch (true) {
    case includes(coinOrLocation, SUPPORTED_COINS):
      return (
        <FormattedHTMLMessage
          id='scenes.wallet.menutop.balance.balance'
          defaultMessage='{coin} Balance'
          values={{ coin: COIN_MODELS[coinOrLocation].displayName }}
        />
      )
    case coinOrLocation.includes('LOCKBOX'):
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.lockboxbalance'
          defaultMessage='Lockbox Balance'
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
      {getBalanceMessage(props.coinOrLocation)}
    </BalanceText>
    <BalanceDropdown>
      <ComponentDropdown
        down
        forceSelected
        toggleOnCallback={false}
        selectedComponent={getSelectedComponent(props.coinOrLocation)}
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
