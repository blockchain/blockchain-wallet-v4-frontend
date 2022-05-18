import React from 'react'
import { FormattedMessage } from 'react-intl'

import CoinDisplay from 'components/Display/CoinDisplay'
import { CellHeaderText, CellText } from 'components/Table'

export const getPriceColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return (
      <CellText>
        {values.total_price || values.bid_amount ? (
          <CoinDisplay coin='ETH' weight={600} size='14px' color='grey900'>
            {values.total_price || values.bid_amount}
          </CoinDisplay>
        ) : (
          '--'
        )}
      </CellText>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.price' defaultMessage='Price' />
    </CellHeaderText>
  ),
  accessor: (row) => {
    return row.total_price || row.bid_amount
  },
  disableGlobalFilter: true,
  id: 'price'
})
