import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Exchange } from '@core'
import { CellHeaderText, CellText } from 'components/Table'

export const getBalanceColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    const { balance, coin } = values
    const { coinfig } = window.coins[coin]
    const amt = Exchange.convertCoinToCoin({
      coin,
      isFiat: coinfig.type.name === 'FIAT',
      value: balance
    })

    return (
      <CellText>
        {Number(amt).toFixed(4)} {coin}
      </CellText>
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
