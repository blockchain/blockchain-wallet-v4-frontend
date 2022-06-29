import React from 'react'
import { FormattedMessage } from 'react-intl'
import { formatDistanceToNow } from 'date-fns'

import { CellHeaderText, CellText } from 'components/Table'

export const getExpirationColumn = () => ({
  Cell: ({ row: { original: offer } }) => {
    return (
      <CellText>
        {formatDistanceToNow(new Date(offer?.expiration_time * 1000)).replace('about', '')}
      </CellText>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.expiration' defaultMessage='Expiration' />
    </CellHeaderText>
  ),
  accessor: 'expiration',
  disableGlobalFilter: true
})
