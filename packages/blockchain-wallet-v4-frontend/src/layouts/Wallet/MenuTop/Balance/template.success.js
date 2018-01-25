import React from 'react'
import PropTypes from 'prop-types'
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
  > div > ul {
    padding-top: 20px;
    background-color: 
  }
`

const Success = props => {
  const { bitcoinContext, etherContext } = props

  const getComponentOrder = () => {
    return [<TotalBalance />, <BitcoinBalance context={bitcoinContext} />, <EtherBalance context={etherContext} />]
  }

  return (
    <Wrapper>
      <Text size={20} weight={300}>
        <FormattedMessage id='scenes.wallet.menutop.balance.totalbalance' defaultMessage='Total Balance' />
      </Text>
      <BalanceDropdown>
        <ComponentDropdown
          down
          forceSelected
          selectedComponent={<TotalBalance />}
          components={getComponentOrder()}
          callback={() => {}} />
      </BalanceDropdown>
    </Wrapper>
  )
}

export default Success
