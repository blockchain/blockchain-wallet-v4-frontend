import React from 'react'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'

import {
  HomeBalanceRow,
  HomeBalanceTable,
  HomeCoinBalanceCell,
  HomeBalanceAmount
} from 'components/Balances'

const TxLink = styled(LinkContainer)`
  &:hover {
    cursor: pointer;
  }
`
const Success = props => {
  const { viewType, balances } = props

  return (
    <HomeBalanceTable>
      <HomeBalanceRow>
        <HomeBalanceAmount data-e2e='homeBalanceAmt'>
          {balances.totalBalance.totalBalance}
        </HomeBalanceAmount>
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
