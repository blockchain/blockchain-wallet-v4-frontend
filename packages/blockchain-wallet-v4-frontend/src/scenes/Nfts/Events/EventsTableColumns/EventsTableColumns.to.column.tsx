import React from 'react'
import { FormattedMessage } from 'react-intl'

import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { CellHeaderText, CellText } from 'components/Table'

export const getToColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return (
      <CellText>
        <CryptoAddress>{values.to?.address || values.winner?.address}</CryptoAddress>
      </CellText>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.to' defaultMessage='To' />
    </CellHeaderText>
  ),
  accessor: 'to.address',
  disableGlobalFilter: true
})
