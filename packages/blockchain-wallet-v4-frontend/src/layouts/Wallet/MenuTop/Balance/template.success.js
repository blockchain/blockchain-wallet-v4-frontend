import React from 'react'
import styled from 'styled-components'

import TotalBalance from './TotalBalance'
import BitcoinBalance from './BitcoinBalance'
import EtherBalance from './EtherBalance'
import { FormattedMessage } from 'react-intl'
import { ComponentDropdown, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  & > * { margin-right: 5px; }

  @media(min-width: 850px) { align-items: flex-end; }
`

const BalanceDropdown = styled.div`
  margin-top: 4px;
  > div > ul {
    top: -6px;
    right: 0px;
    padding: 0;
    padding-top: 5px;
    position: absolute;
    background: transparent;
    > li {
      padding: 0px 6px;
      text-align: right;
      background: ${props => props.theme['white']};
      &:first-child {
        margin-bottom: 3px;
        padding-right: 15px;
        background: transparent;
      }
      &:last-child {
        padding-bottom: 2px;
      }
    }
  }
  > div > div > span:last-child {
    top: 1px;
    right: 10px;
    font-size: 14px;
    font-weight: 600;
    position: relative;
  }
`

const Success = props => {
  const { bitcoinContext, etherContext, path } = props

  const getComponentOrder = () => {
    switch (path) {
      case '/btc/transactions': return [<BitcoinBalance large context={bitcoinContext} />, <EtherBalance context={etherContext} />, <TotalBalance />]
      case '/eth/transactions': return [<EtherBalance large context={etherContext} />, <BitcoinBalance context={bitcoinContext} />, <TotalBalance />]
      default: return [<TotalBalance large />, <BitcoinBalance context={bitcoinContext} />, <EtherBalance context={etherContext} />]
    }
  }

  const getBalanceMessage = () => {
    switch (path) {
      case '/btc/transactions': return <FormattedMessage id='scenes.wallet.menutop.balance.bitcoinbalance' defaultMessage='Bitcoin Balance' />
      case '/eth/transactions': return <FormattedMessage id='scenes.wallet.menutop.balance.etherbalance' defaultMessage='Ether Balance' />
      default: return <FormattedMessage id='scenes.wallet.menutop.balance.totalbalance' defaultMessage='Total Balance' />
    }
  }

  return (
    <Wrapper>
      <Text size={'20px'} weight={300}>
        {getBalanceMessage()}
      </Text>
      <BalanceDropdown>
        <ComponentDropdown
          down
          forceSelected
          color={'gray-5'}
          selectedComponent={getComponentOrder()[0]}
          components={getComponentOrder()}
          callback={() => {}} />
      </BalanceDropdown>
    </Wrapper>
  )
}

export default Success
