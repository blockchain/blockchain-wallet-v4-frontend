import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

import { TableColumnsType } from '..'
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

export const getNameColumn = (modalActions: TableColumnsType['modalActions']) => ({
  Cell: ({ row: { original: values } }) => {
    return (
      <CellWrapper
        onClick={() => {
          modalActions.showModal('REQUEST_CRYPTO_MODAL', {
            origin: 'Prices',
            preselectedCoin: values.coin
          })
        }}
      >
        <CoinIcon name={values.coin} size='32px' color={values.coin} />
        <CellText>{values.name}</CellText>
      </CellWrapper>
    )
  },
  Header: () => (
    <HeaderWrapper>
      <CellHeaderText>
        <FormattedMessage id='copy.name' defaultMessage='Name' />
      </CellHeaderText>
    </HeaderWrapper>
  ),
  accessor: 'name',
  sortType: 'alphanumeric'
})

export default getNameColumn
