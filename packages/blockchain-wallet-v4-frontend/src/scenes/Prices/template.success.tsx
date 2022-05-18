import React, { useCallback, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { useGlobalFilter, useSortBy, useTable } from 'react-table'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'

import { CellText, HeaderText, HeaderToggle, TableWrapper } from 'components/Table'

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

const initialState = {
  sortBy: [{ desc: true, id: 'marketCap' }]
}

const PricesTable = (props: Props) => {
  const { buySellActions, data, modalActions, routerActions, walletCurrency } = props

  const columns = useMemo(
    getTableColumns({
      buySellActions,
      modalActions,
      routerActions,
      walletCurrency
    }),
    []
  )

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows,
    setGlobalFilter,
    state
  } = useTable(
    {
      columns,
      data,
      initialState,
      ...{
        disableMultiSort: true,
        disableSortRemove: true
      }
    },
    useGlobalFilter,
    useSortBy
  )

  // if the table's filter state and redux form textFilter input dont match
  // update so they do, allowing text filtering to work
  if (state.globalFilter !== props.textFilter) {
    setGlobalFilter(props.textFilter)
  }

  // limit no match found length to something reasonable
  const filterMatchText =
    (state.globalFilter?.length > 20 && `${state.globalFilter.substring(0, 20)}…`) ||
    state.globalFilter

  const RenderRow = useCallback(
    ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)
      return (
        <div key={`row-${row.id}`} {...row.getRowProps({ style })} className='tr'>
          {row.cells.map((cell) => (
            <div key={`cell-${cell.row.id}`} {...cell.getCellProps()} className='td'>
              {cell.render('Cell')}
            </div>
          ))}
        </div>
      )
    },
    [prepareRow, rows]
  )

  return (
    <TableWrapper cellWidth='16%' minCellWidth='150px' height='calc(100% - 97px)'>
      {state.globalFilter?.length && !rows.length ? (
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
          <div>
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
          <TableBodyWrapper className='tbody'>
            <AutoSizer disableWidth>
              {({ height }) => (
                <List
                  height={height}
                  itemCount={rows.length}
                  itemSize={90}
                  {...getTableBodyProps()}
                >
                  {RenderRow}
                </List>
              )}
            </AutoSizer>
          </TableBodyWrapper>
        </div>
      )}
    </TableWrapper>
  )
}

type Props = _P & { data: _S }
export default PricesTable
