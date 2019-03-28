import React from 'react'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import {
  HomeBalanceRow,
  HomeBalanceTable,
  HomeCoinBalanceCell
} from 'components/Balances'

const TotalRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 60px;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`

const HomeTitle = styled.div`
  flex-grow: 1;
  padding: 10px 20px;
`

const HomeBalanceAmount = styled(Text)`
  padding: 10px 20px;
  font-size: 28px;
  font-weight: 300;
  color: ${props => props.theme['brand-primary']};
`

const TxLink = styled(LinkContainer)`
  &:hover {
    cursor: pointer;
  }
`
const Success = props => {
  const { viewType, balances } = props
  return (
    <HomeBalanceTable>
      <TotalRow>
        <HomeTitle>
          <Text size='20px' weight={300}>
            <FormattedMessage
              id='components.balances.home.total'
              defaultMessage='Total Balance'
            />
          </Text>
        </HomeTitle>
        <div>
          <HomeBalanceAmount data-e2e='homeBalanceAmt'>
            {balances.totalBalance.totalBalance}
          </HomeBalanceAmount>
        </div>
      </TotalRow>
      <HomeBalanceRow data-e2e='balanceTablePax'>
        <TxLink to={'/pax/transactions'}>
          <div>
            <HomeCoinBalanceCell
              coin='PAX'
              coinName='USD Pax'
              coinIcon='dollars'
              balance={balances.paxBalance}
            />
          </div>
        </TxLink>
      </HomeBalanceRow>
      <HomeBalanceRow data-e2e='balanceTableBtc'>
        <TxLink to={viewType === 'Lockbox' ? '/lockbox' : '/btc/transactions'}>
          <div>
            <HomeCoinBalanceCell
              coin='BTC'
              coinName='Bitcoin'
              coinIcon='btc-circle-filled'
              balance={balances.btcBalance}
            />
          </div>
        </TxLink>
      </HomeBalanceRow>
      <HomeBalanceRow data-e2e='balanceTableEth'>
        <TxLink to={viewType === 'Lockbox' ? '/lockbox' : '/eth/transactions'}>
          <div>
            <HomeCoinBalanceCell
              coin='ETH'
              coinName='Ether'
              coinIcon='eth-circle-filled'
              balance={balances.ethBalance}
            />
          </div>
        </TxLink>
      </HomeBalanceRow>
      <HomeBalanceRow data-e2e='balanceTableBch'>
        <TxLink to={viewType === 'Lockbox' ? '/lockbox' : '/bch/transactions'}>
          <div>
            <HomeCoinBalanceCell
              coin='BCH'
              coinName='Bitcoin Cash'
              coinIcon='bch-circle-filled'
              balance={balances.bchBalance}
            />
          </div>
        </TxLink>
      </HomeBalanceRow>
      <HomeBalanceRow data-e2e='balanceTableXlm'>
        <TxLink to={viewType === 'Lockbox' ? '/lockbox' : '/xlm/transactions'}>
          <div>
            <HomeCoinBalanceCell
              coin='XLM'
              coinName='Stellar'
              coinIcon='xlm-circle-filled'
              balance={balances.xlmBalance}
            />
          </div>
        </TxLink>
      </HomeBalanceRow>
    </HomeBalanceTable>
  )
}
export default Success
