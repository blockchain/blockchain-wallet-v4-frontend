import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

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
const CoinIcon = styled(Icon)`
  margin-right: 16px;
`

export const getNameColumn = routerActions => ({
  Header: () => (
    <HeaderWrapper>
      <CellHeaderText>
        <FormattedMessage id='copy.name' defaultMessage='Name' />
      </CellHeaderText>
    </HeaderWrapper>
  ),
  accessor: 'name',
  sortType: 'alphanumeric',
  Cell: ({ row: { original: values } }) => {
    return (
      <CellWrapper
        onClick={() => routerActions.push(values.coinModel.txListAppRoute)}
      >
        <CoinIcon
          name={values.coinModel?.coinCode}
          size='32px'
          color={values.coinModel?.coinCode}
        />
        <CellText>{values.name}</CellText>
      </CellWrapper>
    )
  }
})
