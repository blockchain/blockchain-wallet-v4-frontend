import React, { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import { HeaderText } from 'blockchain-wallet-v4-frontend/src/scenes/Prices/Table'

import { ExplorerGatewayNftCollectionType } from '@core/network/api/nfts/types'

import { getNameColumn } from './name.column'

export const getTableColumns = () => [getNameColumn()]

const TrendingCollectionsTable: React.FC<Props> = ({ collections }) => {
  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns: useMemo(() => getTableColumns(), []),
      data: useMemo(() => collections, [collections]),
      disableMultiSort: true,
      disableSortRemove: true,
      initialState: {
        sortBy: [{ id: 'name' }]
      }
    },
    useSortBy
  )

  return (
    <div {...getTableProps()} className='table'>
      <div>
        {headerGroups.map((headerGroup) => (
          // eslint-disable-next-line react/jsx-key
          <div {...headerGroup.getHeaderGroupProps()} className='tr'>
            {headerGroup.headers.map((column) => (
              <div
                key={column.key}
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className='th'
              >
                <HeaderText>
                  {column.render('Header')}
                  <div>
                    {column.isSorted ? column.isSortedDesc ? <span>▾</span> : <span>▴</span> : ''}
                  </div>
                </HeaderText>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ height: '100%' }}>
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
      </div>
    </div>
  )
}

type Props = {
  collections: ExplorerGatewayNftCollectionType[]
}

export default TrendingCollectionsTable
