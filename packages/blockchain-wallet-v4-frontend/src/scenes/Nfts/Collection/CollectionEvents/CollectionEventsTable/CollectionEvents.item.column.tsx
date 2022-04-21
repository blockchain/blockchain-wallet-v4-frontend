import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

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
    return (
      <ItemCell>
        <AssetImage alt='asset' src={values.asset?.image_url} />
        {values.asset?.name}
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
