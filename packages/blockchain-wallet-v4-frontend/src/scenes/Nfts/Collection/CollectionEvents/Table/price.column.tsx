import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CellHeaderText, CellText } from 'components/Table'

export const getPriceColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return <CellText>{values.total_price}</CellText>
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.price' defaultMessage='Price' />
    </CellHeaderText>
  ),
  accessor: 'total_price',
  disableGlobalFilter: true
})
