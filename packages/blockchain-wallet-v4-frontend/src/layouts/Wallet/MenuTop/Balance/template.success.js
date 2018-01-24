import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { SimpleDropdown, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  & > * { margin-right: 5px; }

  @media(min-width: 850px) { align-items: flex-end; }
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
          { value: 1,
            text: <Row>
              <CoinDisplay coin='BTC'>{bitcoinBalance}</CoinDisplay>
              <FiatDisplay coin='BTC'>{bitcoinBalance}</FiatDisplay>
            </Row>
          },
          { value: 2,
            text: <Row>
              <CoinDisplay coin='ETH'>{etherBalance}</CoinDisplay>
              <FiatDisplay coin='ETH'>{etherBalance}</FiatDisplay>
            </Row> }]} />
    </Wrapper>
  )
}

export default Success
