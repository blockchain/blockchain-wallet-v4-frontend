import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import BitcoinBalance from './BitcoinBalance'
import EtherBalance from './EtherBalance'
import { SimpleDropdown, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  & > * { margin-right: 5px; }

  @media(min-width: 850px) { align-items: flex-end; }
`

const Success = props => {
  const { balances } = props
  const { bitcoinBalance, etherBalance, totalFiatBalance, symbol } = balances

  return (
    <Wrapper>
      <Text>
        <FormattedMessage id='layouts.wallet.menutop.balance.total' defaultMessage='Total Balance' />
      </Text>
      <SimpleDropdown
        down
        selectedValue={0}
        items={[{ value: 0, text: `${symbol}${totalFiatBalance}` },
        { value: 1, text: <div><CoinDisplay coin='BTC'>bitcoinBalance</CoinDisplay></div> },
        { value: 2, text: 'ho' }]}
        callback={this.handleClick} />
    </Wrapper>
  )
}

Success.propTypes = {
  handleCoinDisplay: PropTypes.func.isRequired
}

export default Success
