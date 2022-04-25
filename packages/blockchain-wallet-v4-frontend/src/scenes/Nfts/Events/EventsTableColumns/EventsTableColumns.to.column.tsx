import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Link } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { CellHeaderText, CellText } from 'components/Table'

export const getToColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    const to = values.to?.address || values.winner?.address

    return (
      <CellText>
        <LinkContainer to={`/nfts/address/${to}`}>
          <Link size='14px' weight={600}>
            <CryptoAddress>{to}</CryptoAddress>
          </Link>
        </LinkContainer>
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
