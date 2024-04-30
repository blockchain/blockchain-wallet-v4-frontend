import React, { useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import { useGlobalFilter, useSortBy, useTable } from 'react-table'
import { formValueSelector } from 'redux-form'
import styled from 'styled-components'

import { getCoinViewV2 } from '@core/redux/walletOptions/selectors'
import { CellText, HeaderText, HeaderToggle, TableWrapper } from 'components/Table'

import { SuccessStateType as _S } from '.'
import { getNameColumn } from './Table/name.column'
import { getPriceColumn } from './Table/price.column'
import { getPriceChangeColumn } from './Table/priceChange.column'
import { getActionsColumn } from './Table/actions.column'
import { getBalanceColumn } from './Table/balance.column'
import { getMarketCapColumn } from './Table/marketCap.column'

const NoResultsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 120px;
`

export const TableBodyWrapper = styled.div`
  height: 100%;
  flex: 1 1 auto;
  overflow: hidden;
`

const PricesTable = ({ data }) => {
  const isCoinViewV2Enabled = useSelector(getCoinViewV2, shallowEqual).getOrElse(false) as boolean
  const textFilter = useSelector((state) => formValueSelector('prices')(state, 'textFilter'))

  const columns = useMemo(
    () => [
      getNameColumn(),
      getPriceColumn(),
      getPriceChangeColumn(),
      getMarketCapColumn(),
      getBalanceColumn(),
      getActionsColumn()
    ],
    [isCoinViewV2Enabled]
  )

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows,
    setGlobalFilter,
    state: { globalFilter }
  } = useTable(
    {
      columns,
      data,
      disableMultiSort: true
    },
    useGlobalFilter,
    useSortBy
  )

  // if the table's filter state and redux form textFilter input dont match
  // update so they do, allowing text filtering to work
  if (globalFilter !== textFilter) {
    setGlobalFilter(textFilter)
  }

  // limit no match found length to something reasonable
  const filterMatchText =
    globalFilter?.length > 20 ? `${globalFilter.substring(0, 20)}…` : globalFilter

  return (
    <TableWrapper cellWidth='16%' minCellWidth='150px' height='calc(100% - 97px)'>
      {globalFilter?.length && !rows.length ? (
        <NoResultsWrapper>
          <CellText color='grey900' size='18px'>
            <span role='img' aria-label='detective emoji'>
              🕵️‍♀️
            </span>
            &nbsp;&nbsp;&nbsp;
            <FormattedMessage
              id='scenes.prices.noresults'
              defaultMessage='No assets match {filterValue}'
              values={{ filterValue: `"${filterMatchText}"` }}
            />
          </CellText>
        </NoResultsWrapper>
      ) : (
        <div {...getTableProps()} className='table'>
          <div className='thead'>
            {headerGroups.map((headerGroup, i) => {
              const key = headerGroup.headers[i].id
              return (
                <div key={key} {...headerGroup.getHeaderGroupProps()} className='tr'>
                  {headerGroup.headers.map((column) => (
                    <div
                      key={column.key}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className='th'
                    >
                      <HeaderText>
                        {column.render('Header')}
                        <div>
                          {column.isSorted ? (
                            <HeaderToggle>{column.isSortedDesc ? '▾' : '▴'}</HeaderToggle>
                          ) : (
                            ''
                          )}
                        </div>
                      </HeaderText>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
          <TableBodyWrapper {...getTableBodyProps()} className='tbody'>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <div key={`row-${row.id}`} {...row.getRowProps()} className='tr'>
                  {row.cells.map((cell) => (
                    <div key={`cell-${cell.row.id}`} {...cell.getCellProps()} className='td'>
                      {cell.render('Cell')}
                    </div>
                  ))}
                </div>
              )
            })}
          </TableBodyWrapper>
        </div>
      )}
    </TableWrapper>
  )
}

export default PricesTable
