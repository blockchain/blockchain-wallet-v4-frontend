import React from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { fiatToString } from '@core/exchange/utils'
import { CellHeaderText, CellText } from 'components/Table'

import { shallowEqual, useSelector } from 'react-redux'
import { getWalletCurrency } from 'data/components/interest/selectors'

const MarketCapCell = ({ row: { original: values } }) => {
  const walletCurrency = useSelector(getWalletCurrency, shallowEqual).getOrElse('USD')

  return <CellText>{fiatToString({ unit: walletCurrency, value: values.marketCap })}</CellText>
}

export const getMarketCapColumn = () => ({
  Cell: MarketCapCell,
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
