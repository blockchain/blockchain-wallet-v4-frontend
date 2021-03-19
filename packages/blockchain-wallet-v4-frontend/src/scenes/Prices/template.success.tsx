import React from 'react'
import { useGlobalFilter, useSortBy, useTable } from 'react-table'

import { getTableColumns, HeaderText, TableWrapper } from './Table'

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
    rows
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

  return (
    <TableWrapper>
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
          {rows?.map(row => {
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
    </TableWrapper>
  )
}

export default PricesTable
