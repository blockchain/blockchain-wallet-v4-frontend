import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CellHeaderText, CellText } from '.'

export const getLinkColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return <CellText>{values.sessionDetails.peerMeta.url}</CellText>
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.link' defaultMessage='Link' />
    </CellHeaderText>
  ),
  accessor: 'link',
  sortType: 'alphanumeric'
})
