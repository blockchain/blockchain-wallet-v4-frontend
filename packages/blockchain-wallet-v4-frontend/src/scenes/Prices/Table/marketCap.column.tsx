import React from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { fiatToString } from '@core/exchange/utils'
import { CellHeaderText, CellText } from 'components/Table'

import { TableColumnsType } from '..'

export const getMarketCapColumn = (walletCurrency: TableColumnsType['walletCurrency']) => ({
  Cell: ({ row: { original: values } }) => (
    <CellText>{fiatToString({ unit: walletCurrency, value: values.marketCap })}</CellText>
  ),
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.market)_cap' defaultMessage='Market Cap' />
    </CellHeaderText>
  ),
  accessor: 'marketCap',
  disableGlobalFilter: true,
  sortType: (a, b, id) => {
    const aBigNum = new BigNumber(a.original[id])
    const bBigNum = new BigNumber(b.original[id])

    if (aBigNum.isGreaterThan(bBigNum)) return 1
    if (bBigNum.isGreaterThan(aBigNum)) return -1
    return 0
  }
})
