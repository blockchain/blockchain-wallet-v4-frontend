import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CellHeaderText, CellText } from 'components/Table'

export const getVolumeColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return <CellText>{values.one_day_volume}</CellText>
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.24h_volume' defaultMessage='24 Hour Volume' />
    </CellHeaderText>
  ),
  accessor: 'one_day_volume',
  disableGlobalFilter: true
})
