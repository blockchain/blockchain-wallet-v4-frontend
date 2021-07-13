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
  sortBy: [{ id: 'price', desc: true }]
}

const PricesTable = props => {
  const { data, modalActions, routerActions, walletCurrency } = props

  const columns = React.useMemo(
    getTableColumns({ modalActions, routerActions, walletCurrency }),
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
    (state.globalFilter?.length > 20 &&
      state.globalFilter.substring(0, 20) + '…') ||
    state.globalFilter

  return (
    <TableWrapper>
      {state.globalFilter?.length && !rows.length ? (
        <NoResultsWrapper>
          <CellText color='grey900' size='18px'>
            🕵️‍♀️&nbsp;&nbsp;&nbsp;
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
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
