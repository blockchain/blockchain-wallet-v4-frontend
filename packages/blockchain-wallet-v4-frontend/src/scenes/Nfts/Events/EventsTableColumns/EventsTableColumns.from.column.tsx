import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Link } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { CellHeaderText, CellText } from 'components/Table'

export const getFromColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    const from = values.from?.address || values.seller?.address

    return (
      <CellText>
        <LinkContainer to={`/nfts/address/${from}`}>
          <Link size='14px' weight={600}>
            <CryptoAddress>{from}</CryptoAddress>
          </Link>
        </LinkContainer>
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
