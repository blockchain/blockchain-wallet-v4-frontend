import React from 'react'
import { FormattedMessage } from 'react-intl'

import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { CellHeaderText, CellText } from 'components/Table'

export const getFromColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return (
      <CellText>
        <CryptoAddress>{values.from?.address || values.seller?.address}</CryptoAddress>
      </CellText>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.from' defaultMessage='From' />
    </CellHeaderText>
  ),
  accessor: 'from.address',
  disableGlobalFilter: true
})
