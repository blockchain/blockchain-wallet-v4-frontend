import React from 'react'
import { FormattedMessage } from 'react-intl'

import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'

import { CellHeaderText, CellText } from '.'

export const getPriceColumn = walletCurrency => ({
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.price' defaultMessage='Price' />
    </CellHeaderText>
  ),
  accessor: 'price',
  disableGlobalFilter: true,
  sortType: (a, b, id) => {
    if (a.original[id] > b.original[id]) return 1
    if (b.original[id] > a.original[id]) return -1
    return 0
  },
  Cell: ({ row: { original: values } }) => {
    return (
      <CellText>
        {fiatToString({ value: values.price, unit: walletCurrency })}
      </CellText>
    )
  }
})
