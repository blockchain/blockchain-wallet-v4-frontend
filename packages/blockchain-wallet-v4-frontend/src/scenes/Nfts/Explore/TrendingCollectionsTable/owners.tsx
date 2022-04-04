import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CellHeaderText, CellText } from 'components/Table'

export const getOwnersColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return <CellText>{values.num_owners}</CellText>
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.owners' defaultMessage='Owners' />
    </CellHeaderText>
  ),
  accessor: 'num_owners',
  disableGlobalFilter: true
})
