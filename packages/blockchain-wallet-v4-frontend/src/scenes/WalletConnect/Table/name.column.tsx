import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { CellHeaderText, CellText } from '.'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 8px;
`
const CellWrapper = styled(HeaderWrapper)`
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`
const Logo = styled.img`
  margin-right: 16px;
`

export const getNameColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return (
      <CellWrapper>
        <Logo
          src={values.sessionDetails.peerMeta.icons[0]}
          alt={values.sessionDetails.peerMeta.name}
          width='32'
          height='32'
        />
        <CellText size='16px'>{values.sessionDetails.peerMeta.name}</CellText>
      </CellWrapper>
    )
  },
  Header: () => (
    <HeaderWrapper>
      <CellHeaderText capitalize>
        <FormattedMessage id='copy.dapp' defaultMessage='dapp' />
      </CellHeaderText>
    </HeaderWrapper>
  ),
  accessor: 'name',
  sortType: 'alphanumeric'
})

export default getNameColumn
