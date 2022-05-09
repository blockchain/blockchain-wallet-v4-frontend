import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CellHeaderText, CellText } from 'components/Table'

export const getDateColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return <CellText>{new Date(values.created_date).toLocaleDateString()}</CellText>
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.date' defaultMessage='Date' />
    </CellHeaderText>
  ),
  accessor: 'created_date',
  disableGlobalFilter: true
})
