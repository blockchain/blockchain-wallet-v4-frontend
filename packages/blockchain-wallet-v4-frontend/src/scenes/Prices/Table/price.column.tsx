import React from 'react'
import { FormattedMessage } from 'react-intl'

import FiatDisplay from 'components/Display/FiatDisplay'

import { CellHeaderText, CellText } from '.'

export const getPriceColumn = walletCurrency => ({
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.price' defaultMessage='Price' />
    </CellHeaderText>
  ),
  accessor: 'price',
  disableGlobalFilter: true,
  sortType: (rowA, rowB, id) => {
    const a = rowA.original[id][walletCurrency].last
    const b = rowB.original[id][walletCurrency].last
    if (a > b) return 1
    if (b > a) return -1
    return 0
  },
  Cell: ({ row: { original: values } }) => {
    return (
      <CellText>
        <FiatDisplay
          color='grey900'
          coin={walletCurrency}
          currency={walletCurrency}
          loadingHeight='24px'
          size='16px'
          style={{ lineHeight: '24px' }}
          weight={500}
        >
          {values.price[walletCurrency]?.last}
        </FiatDisplay>
      </CellText>
    )
  }
})
