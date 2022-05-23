import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Link } from 'blockchain-info-components'
import { CellHeaderText, CellText } from 'components/Table'

const ItemCell = styled(CellText)`
  display: flex;
  align-items: center;
  gap: 8px;
`

const AssetImage = styled.img`
  height: 32px;
  border-radius: 8px;
`

export const getItemColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    if (!values.asset?.name) return null

    return (
      <ItemCell>
        <AssetImage alt='asset' src={values.asset?.image_url} />
        <LinkContainer
          to={`/nfts/assets/${values.asset?.contract_address}/${values.asset?.token_id}`}
        >
          <Link size='14px' weight={600} color='grey900'>
            {values.asset?.name}
          </Link>
        </LinkContainer>
      </ItemCell>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.item' defaultMessage='Item' />
    </CellHeaderText>
  ),
  accessor: 'asset.name',
  disableGlobalFilter: true
})
