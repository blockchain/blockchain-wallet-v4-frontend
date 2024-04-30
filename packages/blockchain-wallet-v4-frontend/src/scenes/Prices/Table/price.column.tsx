import React from 'react'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'

import { fiatToString } from '@core/exchange/utils'
import { CellHeaderText, CellText } from 'components/Table'
import { getWalletCurrency } from 'data/components/interest/selectors'

const PriceCell = ({ row: { original: values } }) => {
  const walletCurrency = useSelector(getWalletCurrency, shallowEqual).getOrElse('USD')

  return <CellText>{fiatToString({ unit: walletCurrency, value: values.price })}</CellText>
}

export const getPriceColumn = () => ({
  Cell: PriceCell,
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.price' defaultMessage='Price' />
    </CellHeaderText>
  ),
  accessor: 'price',
  disableGlobalFilter: true,
  sortType: (a, b, id) => {
    if (a.original[id] > b.original[id]) return 1
    if (b.original[id] > a.original[id]) return -1
    return 0
  }
})
