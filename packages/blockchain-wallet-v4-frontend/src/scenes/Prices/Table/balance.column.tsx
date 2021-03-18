import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import CoinDisplay from 'components/Display/CoinDisplay'

import { CellHeaderText } from '.'

const BalanceDisplay = styled(CoinDisplay)`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${props => props.color};
`

export const getBalanceColumn = () => ({
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.balance' defaultMessage='Balance' />
    </CellHeaderText>
  ),
  accessor: 'balance',
  disableGlobalFilter: true,
  sortType: 'basic',
  Cell: ({ row: { original: values } }) => {
    const { balance, coin } = values
    return (
      <BalanceDisplay
        coin={coin}
        color={balance !== '0' ? 'grey900' : 'grey400'}
      >
        {balance}
      </BalanceDisplay>
    )
  }
})
