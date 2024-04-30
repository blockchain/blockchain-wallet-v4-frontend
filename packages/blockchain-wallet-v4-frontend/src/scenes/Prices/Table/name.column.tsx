import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'
import { getData as getUserCountry } from 'components/Banner/selectors'
import { CellHeaderText, CellText } from 'components/Table'
import { ModalName } from 'data/types'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getCoinViewV2 } from '@core/redux/walletOptions/selectors'
import { modals } from 'data/actions'
import { push } from 'connected-react-router'

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

const NameCell = ({ row: { original: values } }) => {
  const dispatch = useDispatch()

  const { country, signupCountry } = useSelector(getUserCountry, shallowEqual)
  const isCoinViewV2Enabled = useSelector(getCoinViewV2, shallowEqual).getOrElse(false) as boolean
  
  const isUkUser = [country, signupCountry].some((code) => code === 'GB')

  return (
    <CellWrapper
      onClick={() => {
        if (isCoinViewV2Enabled || isUkUser) {
          dispatch(push(`/coins/${values.coin}`))
        } else {
          dispatch(
            modals.showModal(ModalName.REQUEST_CRYPTO_MODAL, {
              origin: 'Prices',
              preselectedCoin: values.coin
            })
          )
        }
      }}
    >
      <Icon name={values.coin} size='32px' color={values.coin} />
      <CellText>{values.name}</CellText>
    </CellWrapper>
  )
}

export const getNameColumn = () => ({
  Cell: NameCell,
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
