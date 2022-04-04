import React, { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'

import { ExplorerGatewayNftCollectionType } from '@core/network/api/nfts/types'
import { HeaderText, HeaderToggle, StickyTableHeader, TableWrapper } from 'components/Table'

import { Props as OwnProps } from '..'
import { getFloorPriceColumn } from './floor_price'
import { getNameColumn } from './name.column'
import { getOwnersColumn } from './owners'
import { getTotalSupplyColumn } from './supply'
import { getVolumeColumn } from './volume.column'

export const getTableColumns = (routerActions) => [
  getNameColumn(routerActions),
  getVolumeColumn(),
  getFloorPriceColumn(),
  getOwnersColumn(),
  getTotalSupplyColumn()
]

const TrendingCollectionsTable: React.FC<Props> = ({ collections, routerActions }) => {
  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns: useMemo(() => getTableColumns(routerActions), []),
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
      <div {...getTableProps({ style: { height: '360px', overflow: 'scroll' } })} className='table'>
        <StickyTableHeader>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <div {...headerGroup.getHeaderGroupProps({})} className='tr'>
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
          ))}
        </StickyTableHeader>
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

type Props = OwnProps & {
  collections: ExplorerGatewayNftCollectionType[]
}

export default TrendingCollectionsTable
