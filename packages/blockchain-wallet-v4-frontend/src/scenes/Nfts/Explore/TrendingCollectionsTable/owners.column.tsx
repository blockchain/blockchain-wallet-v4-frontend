import React from 'react'
import { FormattedMessage } from 'react-intl'
import * as numeral from 'numeral'

import { CellHeaderText, CellText } from 'components/Table'

export const getOwnersColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return <CellText>{numeral(values.num_owners).format('0,0')}</CellText>
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.owners' defaultMessage='Owners' />
    </CellHeaderText>
  ),
  accessor: 'num_owners',
  disableGlobalFilter: true
})
