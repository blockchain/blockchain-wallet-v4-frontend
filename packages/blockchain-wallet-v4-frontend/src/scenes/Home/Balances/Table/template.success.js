import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import {
  HomeBalanceRow,
  HomeBalanceTable,
  HomeCoinBalanceCell,
  HomeBalanceAmount,
  HomeBalanceHeaderTitle
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
        <HomeBalanceHeaderTitle>
          <FormattedMessage
            id='scenes.home.balance.table.header'
            defaultMessage='{viewType} Balance'
            values={{ viewType }}
          />
        </HomeBalanceHeaderTitle>
        <HomeBalanceAmount>
          {balances.totalBalance.totalBalance}
        </HomeBalanceAmount>
      </HomeBalanceRow>
      <HomeBalanceRow>
        <TxLink to={viewType === 'Lockbox' ? '/lockbox' : '/btc/transactions'}>
          <div>
            <HomeCoinBalanceCell
              coin='BTC'
              coinName='Bitcoin'
              coinIcon='btc'
              balance={balances.btcBalance}
            />
          </div>
        </TxLink>
      </HomeBalanceRow>
      <HomeBalanceRow>
        <TxLink to={viewType === 'Lockbox' ? '/lockbox' : '/eth/transactions'}>
          <div>
            <HomeCoinBalanceCell
              coin='ETH'
              coinName='Ether'
              coinIcon='eth'
              balance={balances.ethBalance}
            />
          </div>
        </TxLink>
      </HomeBalanceRow>
      <HomeBalanceRow>
        <TxLink to={viewType === 'Lockbox' ? '/lockbox' : '/bch/transactions'}>
          <div>
            <HomeCoinBalanceCell
              coin='BCH'
              coinName='Bitcoin Cash'
              coinIcon='bch'
              balance={balances.bchBalance}
            />
          </div>
        </TxLink>
      </HomeBalanceRow>
      <HomeBalanceRow>
        <TxLink to={viewType === 'Lockbox' ? '/lockbox' : '/bch/transactions'}>
          <div>
            <HomeCoinBalanceCell
              coin='XLM'
              coinName='Stellar'
              coinIcon='xlm'
              balance={balances.xlmBalance}
            />
          </div>
        </TxLink>
      </HomeBalanceRow>
    </HomeBalanceTable>
  )
}
export default Success
