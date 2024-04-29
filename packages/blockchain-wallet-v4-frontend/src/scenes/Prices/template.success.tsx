import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { useGlobalFilter, useSortBy, useTable } from 'react-table'
import { formValueSelector } from 'redux-form'
import styled from 'styled-components'

import { getCurrency } from '@core/redux/settings/selectors'
import { getCoinViewV2 } from '@core/redux/walletOptions/selectors'
import { CellText, HeaderText, HeaderToggle, TableWrapper } from 'components/Table'
import { getData as getUserCountry } from 'components/Banner/selectors'

import { Props as _P, SuccessStateType as _S } from '.'
import { getTableColumns } from './Table'

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

const PricesTable = (props: Props) => {
  const isCoinViewV2Enabled = useSelector(getCoinViewV2).getOrElse(false) as boolean
  const isUserFromUK = useSelector(getUserCountry)?.country === 'GB'
  const isIpFromUK = useSelector(getUserCountry)?.ipCountry === 'GB'
  const textFilter = useSelector((state) => formValueSelector('prices')(state, 'textFilter'))
  const walletCurrency = useSelector(getCurrency).getOrElse('USD')
  const isUkUser = isUserFromUK || isIpFromUK
  
  const {
    analyticsActions,
    buySellActions,
    data,
    formActions,
    modalActions,
    routerActions,
    swapActions
  } = props

  const columns = useMemo(
    getTableColumns({
      analyticsActions,
      buySellActions,
      formActions,
      isCoinViewV2Enabled,
      isUkUser,
      modalActions,
      routerActions,
      swapActions,
      walletCurrency
    }),
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
                            column.isSortedDesc ? (
                              <HeaderToggle>▾</HeaderToggle>
                            ) : (
                              <HeaderToggle>▴</HeaderToggle>
                            )
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

type Props = _P & { data: _S }

export default PricesTable
