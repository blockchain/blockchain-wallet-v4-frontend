import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CellHeaderText, CellText } from 'components/Table'

export const getTotalSupplyColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return <CellText>{values.total_supply}</CellText>
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.total_supply' defaultMessage='Total Supply' />
    </CellHeaderText>
  ),
  accessor: 'total_supply',
  disableGlobalFilter: true
})
