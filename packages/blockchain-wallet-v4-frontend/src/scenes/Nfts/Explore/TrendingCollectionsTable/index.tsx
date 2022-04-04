import React, { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'

import { ExplorerGatewayNftCollectionType } from '@core/network/api/nfts/types'
import { HeaderText, TableWrapper } from 'components/Table'

import { getFloorPriceColumn } from './floor_price'
import { getNameColumn } from './name.column'
import { getOwnersColumn } from './owners'
import { getTotalSupplyColumn } from './supply'
import { getVolumeColumn } from './volume.column'

export const getTableColumns = () => [
  getNameColumn(),
  getVolumeColumn(),
  getFloorPriceColumn(),
  getOwnersColumn(),
  getTotalSupplyColumn()
]

const TrendingCollectionsTable: React.FC<Props> = ({ collections }) => {
  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns: useMemo(() => getTableColumns(), []),
      data: useMemo(() => collections, [collections]),
      disableMultiSort: true,
      disableSortRemove: true,
      initialState: {
        sortBy: [{ desc: true, id: 'one_day_volume' }]
      }
    },
    useSortBy
  )

  return (
    <TableWrapper>
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
        <div {...getTableBodyProps()}>
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
    </TableWrapper>
  )
}

type Props = {
  collections: ExplorerGatewayNftCollectionType[]
}

export default TrendingCollectionsTable
