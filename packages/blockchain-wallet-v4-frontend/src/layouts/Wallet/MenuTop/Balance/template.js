import React from 'react'
import styled from 'styled-components'

import TotalBalance from './TotalBalance'
import WalletBalance from './WalletBalance'
import WatchOnlyBalance from './WatchOnlyBalance'
import BtcBalance from './WalletBalance/BtcBalance'
import BchBalance from './WalletBalance/BchBalance'
import EthBalance from './WalletBalance/EthBalance'

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
  font-size: 20px;
  @media (min-width: 768) {
    font-size: 16px;
  }
`
const BalanceDropdown = styled.div`
  margin-top: 4px;
  > div > ul {
    right: 0px;
    padding: 0;
    position: absolute;
  }
  > div > div > span:last-child {
    top: 1px;
    right: 10px;
    font-size: 11px;
    font-weight: 600;
    position: relative;
  }
`

const getComponentOrder = path => {
  return [<WalletBalance />, <WatchOnlyBalance />]
}

const getSelectedComponent = path => {
  switch (path) {
    case '/btc/transactions':
      return <BtcBalance large />
    case '/eth/transactions':
      return <EthBalance large />
    case '/bch/transactions':
      return <BchBalance large />
    default:
      return <TotalBalance large />
  }
}

const getBalanceMessage = path => {
  switch (path) {
    case '/btc/transactions':
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.bitcoinbalance'
          defaultMessage='Bitcoin Balance'
        />
      )
    case '/eth/transactions':
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.etherbalance'
          defaultMessage='Ether Balance'
        />
      )
    case '/bch/transactions':
      return (
        <FormattedMessage
          id='scenes.wallet.menutop.balance.bchbalance'
          defaultMessage='Bitcoin Cash Balance'
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
    <BalanceText weight={300}>{getBalanceMessage(props.path)}</BalanceText>
    <BalanceDropdown>
      <ComponentDropdown
        down
        forceSelected
        color={'gray-5'}
        toggleOnCallback={false}
        selectedComponent={getSelectedComponent(props.path)}
        components={getComponentOrder(props.path)}
        callback={() => {}}
      />
    </BalanceDropdown>
  </Wrapper>
)

export default Success
