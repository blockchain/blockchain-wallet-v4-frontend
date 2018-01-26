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
        padding-right: 30px;
        background: transparent;
      }
      &:last-child {
        padding-bottom: 2px;
      }
    }
  }
  > div > div > div:first-child span {
    padding-right: 15px;
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
  const { bitcoinContext, etherContext } = props

  const getComponentOrder = () => {
    return [<TotalBalance />, <BitcoinBalance context={bitcoinContext} />, <EtherBalance context={etherContext} />]
  }

  return (
    <Wrapper>
      <Text size={'20px'} weight={300}>
        <FormattedMessage id='scenes.wallet.menutop.balance.totalbalance' defaultMessage='Total Balance' />
      </Text>
      <BalanceDropdown>
        <ComponentDropdown
          down
          forceSelected
          color={'gray-5'}
          selectedComponent={<TotalBalance />}
          components={getComponentOrder()}
          callback={() => {}} />
      </BalanceDropdown>
    </Wrapper>
  )
}

export default Success
