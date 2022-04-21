import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CellHeaderText, CellText } from 'components/Table'

export const getItemColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return <CellText>{values.asset?.name}</CellText>
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.item' defaultMessage='Item' />
    </CellHeaderText>
  ),
  accessor: 'asset.name',
  disableGlobalFilter: true
})
