import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useGlobalFilter, useSortBy, useTable } from 'react-table'
import styled from 'styled-components'

import { CellText, getTableColumns, HeaderText, TableWrapper } from './Table'

const NoResultsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 120px;
`

const options = {
  disableMultiSort: true,
  disableSortRemove: true
}

const initialState = {
  sortBy: [{ desc: true, id: 'price' }]
}

const PricesTable = (props) => {
  const { data, modalActions, routerActions, simpleBuyActions, walletCurrency } = props

  const columns = React.useMemo(
    getTableColumns({ modalActions, routerActions, simpleBuyActions, walletCurrency }),
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

  return (
    <TableWrapper>
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
        <table {...getTableProps()}>
          <thead>
            {/* eslint-disable */}
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}> 
                {headerGroup.headers.map(column => (
                  <th
                    key={column.key}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <HeaderText>
                      {column.render('Header')}
                      <div>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <span>▾</span>
                          ) : (
                            <span>▴</span>
                          )
                        ) : (
                          ''
                        )}
                      </div>
                    </HeaderText>
                  </th>
                ))}
              </tr>
            ))}
            {/* eslint-enable */}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <tr key={`row-${row.id}`} {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td key={`cell-${cell.row.id}`} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </TableWrapper>
  )
}

export default PricesTable
