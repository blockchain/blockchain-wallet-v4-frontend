import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'
import { CellHeaderText, CellText } from 'components/Table'
import { ModalName } from 'data/types'

import { TableColumnsType } from '..'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 8px;
`
const CellWrapper = styled(HeaderWrapper)`
  align-items: center;
  gap: 8px;

  &:hover {
    cursor: pointer;
  }
`

export const getNameColumn = (
  modalActions: TableColumnsType['modalActions'],
  routerActions: TableColumnsType['routerActions'],
  isCoinViewV2Enabled: boolean,
  isUkUser: boolean
) => ({
  Cell: ({ row: { original: values } }) => {
    return (
      <CellWrapper
        onClick={() => {
          if (isCoinViewV2Enabled || isUkUser) {
            routerActions.push(`/coins/${values.coin}`)
          } else {
            modalActions.showModal(ModalName.REQUEST_CRYPTO_MODAL, {
              origin: 'Prices',
              preselectedCoin: values.coin
            })
          }
        }}
      >
        <Icon name={values.coin} size='32px' color={values.coin} />
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
