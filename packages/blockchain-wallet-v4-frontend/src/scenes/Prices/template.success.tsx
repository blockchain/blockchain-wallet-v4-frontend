import React, { useCallback, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { useGlobalFilter, useSortBy, useTable } from 'react-table'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'

import { CellText, HeaderText, HeaderToggle, TableWrapper } from 'components/Table'
import { useElementSize } from 'hooks'

import { Props as _P, SuccessStateType as _S } from '.'
import { getTableColumns } from './Table'

const NoResultsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 120px;
`

export const TableBodyWrapper = styled.div`
  height: calc(100% - 52px);
`

const options = {
  disableMultiSort: true,
  disableSortRemove: true
}

const initialState = {
  sortBy: [{ desc: true, id: 'price' }]
}

const PricesTable = (props: Props) => {
  const {
    buySellActions,
    data,
    formActions,
    modalActions,
    routerActions,
    swapActions,
    walletCurrency
  } = props

  const columns = useMemo(
    getTableColumns({
      buySellActions,
      formActions,
      modalActions,
      routerActions,
      swapActions,
      walletCurrency
    }),
    []
  )

  // react-virtualized-auto-sizer grows outside of page width bounds, grab parent table width
  // and set that as width on AutoList's List child element
  const [tableRef, { width: parentTableWidth }] = useElementSize()

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
      ...options
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
    <TableWrapper ref={tableRef}>
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
          <TableBodyWrapper>
            <AutoSizer>
              {({ height }) => (
                <div {...getTableBodyProps()}>
                  <List
                    height={height}
                    width={parentTableWidth}
                    itemCount={rows.length}
                    itemSize={90}
                  >
                    {RenderRow}
                  </List>
                </div>
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
