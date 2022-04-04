import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { CellHeaderText, CellText } from 'components/Table'
import { actions } from 'data'

const NameCell = styled(CellText)`
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
`
const Logo = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin-right: 8px;
`

export const getNameColumn = (routerActions: typeof actions.router) => ({
  Cell: ({ row: { original: values } }) => {
    return (
      <NameCell onClick={() => routerActions.push(`/nfts/collection/${values.slug}`)}>
        <Logo src={values.image_url} />
        {values.name.length < 24 ? values.name : `${values.name.slice(0, 20)}...`}
      </NameCell>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.collection' defaultMessage='Collection' />
    </CellHeaderText>
  ),
  accessor: 'name',
  disableGlobalFilter: true
})
