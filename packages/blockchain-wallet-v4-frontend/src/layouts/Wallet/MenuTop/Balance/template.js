import React from 'react'
import styled from 'styled-components'

import TotalBalance from './TotalBalance'
import WalletBalance from './WalletBalance'
import LockboxBalance from './LockboxBalance'
import LockboxTotalBalance from './LockboxBalance/TotalBalance'
import PendingBalance from './PendingBalance'
import WatchOnlyBalance from './WatchOnlyBalance'
import Balance from './WalletBalance/Balance'
import CurrencySwitch from './CurrencySwitch'

import { FormattedMessage } from 'react-intl'
import { ComponentDropdown, Text } from 'blockchain-info-components'

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

const getComponentOrder = () => [
  <WalletBalance />,
  <LockboxBalance />,
  <PendingBalance />,
  <WatchOnlyBalance />,
  <CurrencySwitch />
]

const getSelectedComponent = path => {
  switch (true) {
    case path.includes('pax'):
      return <Balance large coin='PAX' />
    case path.includes('btc'):
      return <Balance large coin='BTC' />
    case path.includes('eth'):
      return <Balance large coin='ETH' />
    case path.includes('bch'):
      return <Balance large coin='BCH' />
    case path.includes('bsv'):
      return <Balance large coin='BSV' />
    case path.includes('xlm'):
      return <Balance large coin='XLM' />
    case path.includes('lockbox'):
      return <LockboxTotalBalance />
    default:
      return <TotalBalance large />
  }
}

const getBalanceMessage = path => {
  switch (true) {
    case path.includes('pax'):
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.paxbalance'
          defaultMessage='USD Pax Balance'
        />
      )
    case path.includes('btc'):
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.btcbalance'
          defaultMessage='Bitcoin Balance'
        />
      )
    case path.includes('eth'):
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.ethbalance'
          defaultMessage='Ether Balance'
        />
      )
    case path.includes('bch'):
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.bchbalance'
          defaultMessage='Bitcoin Cash Balance'
        />
      )
    case path.includes('bsv'):
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.bsvbalance'
          defaultMessage='Bitcoin SV Balance'
        />
      )
    case path.includes('xlm'):
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.xlmbalance'
          defaultMessage='Stellar Balance'
        />
      )
    case path.includes('lockbox'):
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
      {getBalanceMessage(props.path)}
    </BalanceText>
    <BalanceDropdown>
      <ComponentDropdown
        down
        forceSelected
        toggleOnCallback={false}
        selectedComponent={getSelectedComponent(props.path)}
        components={getComponentOrder()}
        callback={() => {}}
      />
    </BalanceDropdown>
  </Wrapper>
)

export default Success
