import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CellHeaderText, CellText } from 'components/Table'

export const getPriceChangeColumn = () => ({
  Cell: ({ cell: { value } }) => {
    return <CellText color={Number(value) >= 0 ? 'green600' : 'red600'}>{value}%</CellText>
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.price_change' defaultMessage='Price Change' />
    </CellHeaderText>
  ),
  accessor: 'priceChange',

  disableGlobalFilter: true,
  // sortType: 'basic',
  // sortMethod: (a, b) => Number(a)-Number(b),
  sortType: (a, b, id) => {
    if (Number(a.original[id]) > Number(b.original[id])) return 1
    if (Number(b.original[id]) > Number(a.original[id])) return -1
    return 0
  }
})
