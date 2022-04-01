import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

export const getNameColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return <Text>{values.name}</Text>
  },
  Header: () => (
    <Text>
      <FormattedMessage id='copy.collection' defaultMessage='Collection' />
    </Text>
  ),
  accessor: 'name',
  disableGlobalFilter: true
})
