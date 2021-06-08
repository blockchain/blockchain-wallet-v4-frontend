import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Exchange } from 'blockchain-wallet-v4/src'
import CoinDisplay from 'components/Display/CoinDisplay'

import { CellHeaderText } from '.'

const BalanceDisplay = styled(CoinDisplay)`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.color};
`

export const getBalanceColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    const { balance, coin } = values
    return (
      <BalanceDisplay coin={coin} color={balance !== '0' ? 'grey900' : 'grey400'}>
        {balance}
      </BalanceDisplay>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.balance' defaultMessage='Balance' />
    </CellHeaderText>
  ),
  accessor: 'balance',
  disableGlobalFilter: true,
  sortType: (a, b) => {
    const aBalance = Number(
      Exchange.convertCoinToCoin({
        coin: a.original.coin,
        value: a.original.balance
      })
    )
    const bBalance = Number(
      Exchange.convertCoinToCoin({
        coin: b.original.coin,
        value: b.original.balance
      })
    )
    if (aBalance > bBalance) return 1
    if (bBalance > aBalance) return -1
    return 0
  }
})

export default getBalanceColumn
