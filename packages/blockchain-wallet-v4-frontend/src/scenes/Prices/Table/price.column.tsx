import React from 'react'
import { FormattedMessage } from 'react-intl'

import { fiatToString } from '@core/exchange/utils'

import { CellHeaderText, CellText } from '.'

export const getPriceColumn = (walletCurrency) => ({
  Cell: ({ row: { original: values } }) => {
    return <CellText>{fiatToString({ unit: walletCurrency, value: values.price })}</CellText>
  },
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
  }
})
