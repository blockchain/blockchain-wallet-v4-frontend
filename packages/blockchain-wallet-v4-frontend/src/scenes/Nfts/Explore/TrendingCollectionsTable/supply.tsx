import React from 'react'
import { FormattedMessage } from 'react-intl'
import * as numeral from 'numeral'

import { CellHeaderText, CellText } from 'components/Table'

export const getTotalSupplyColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return <CellText>{numeral(values.total_supply).format('0,0')}</CellText>
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.total_supply' defaultMessage='Total Supply' />
    </CellHeaderText>
  ),
  accessor: 'total_supply',
  disableGlobalFilter: true
})
