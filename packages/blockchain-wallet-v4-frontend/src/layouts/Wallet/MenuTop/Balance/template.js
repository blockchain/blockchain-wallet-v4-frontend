import React from 'react'
import styled from 'styled-components'

import TotalBalance from './TotalBalance'
import BtcBalance from './BtcBalance'
import EthBalance from './EthBalance'
import BchBalance from './BchBalance'
import BtcWatchOnlyBalance from './BtcWatchOnlyBalance'
import BchWatchOnlyBalance from './BchWatchOnlyBalance'

import { FormattedMessage } from 'react-intl'
import { ComponentDropdown, Separator, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  @media(min-width: 850px) { align-items: flex-end; }
`
const BalanceText = styled(Text)`
  font-size: 20px;
  @media(min-width: 768) {
    font-size: 16px;
  }
`
const BalanceDropdown = styled.div`
  margin-top: 4px;
  > div > ul {
    top: -6px;
    right: 0px;
    padding: 0;
    padding-top: 5px;
    position: absolute;
    > li {
      padding: 0px 6px;
      text-align: right;
      background: ${props => props.theme['white']};
      &:first-child {
        margin-bottom: 3px;
        padding-right: 12px;
        background: white;
        > div > span:first-child {
          color: ${props => `${props.theme['gray-5']}`};
        }
      }
      &:last-child {
        padding-bottom: 2px;
      }
    }
  }
  > div > div > div > div > span:first-child {
    color: ${props => `${props.theme['gray-5']}`};
  }
  > div > div > span:last-child {
    top: 1px;
    right: 10px;
    font-size: 11px;
    font-weight: 600;
    position: relative;
  }
`
const SubItems = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`

const getComponentOrder = path => {
  switch (path) {
    case '/btc/transactions': return [<BtcBalance large />, <EthBalance />, <BchBalance />, <TotalBalance />]
    case '/eth/transactions': return [<EthBalance large />, <BtcBalance />, <BchBalance />, <TotalBalance />]
    case '/bch/transactions': return [<BchBalance large />, <BtcBalance />, <EthBalance />, <TotalBalance />]
    default: return [<TotalBalance large />, <BtcBalance />, <EthBalance />, <BchBalance />]
  }
}

const getBalanceMessage = path => {
  switch (path) {
    case '/btc/transactions': return <FormattedMessage id='scenes.wallet.menutop.balance.bitcoinbalance' defaultMessage='Bitcoin Balance' />
    case '/eth/transactions': return <FormattedMessage id='scenes.wallet.menutop.balance.etherbalance' defaultMessage='Ether Balance' />
    case '/bch/transactions': return <FormattedMessage id='scenes.wallet.menutop.balance.bchbalance' defaultMessage='Bitcoin Cash Balance' />
    default: return <FormattedMessage id='scenes.wallet.menutop.balance.totalbalance' defaultMessage='Total Balance' />
  }
}

const getSubBalances = props => (
  <SubItems>
    <Separator margin='0' />
    <BtcWatchOnlyBalance />
    <BchWatchOnlyBalance />
  </SubItems>
)

const Success = props => (
  <Wrapper>
    <BalanceText weight={300}>
      {getBalanceMessage(props.path)}
    </BalanceText>
    <BalanceDropdown>
      <ComponentDropdown
        down
        forceSelected
        color={'gray-5'}
        selectedComponent={getComponentOrder(props.path)[0]}
        components={getComponentOrder().concat(getSubBalances())}
        callback={() => {}} />
    </BalanceDropdown>
  </Wrapper>
)

export default Success
