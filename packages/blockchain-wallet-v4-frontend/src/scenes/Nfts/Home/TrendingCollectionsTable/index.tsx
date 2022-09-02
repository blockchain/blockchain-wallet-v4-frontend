import React, { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import { PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import {
  HeaderText,
  HeaderToggle,
  StickyColumn,
  StickyTableHeader,
  TableWrapper
} from 'components/Table'
import { CollectionsQuery } from 'generated/graphql.types'

import { Props as OwnProps } from '../Home'
import { getFloorPriceColumn } from './floor_price'
import { getNameColumn } from './name.column'
import { getOwnersColumn } from './owners.column'
import { getTotalSupplyColumn } from './supply.column'
import { getVolumeColumn } from './volume.column'

export const getTableColumns = () => [
  getNameColumn(),
  getVolumeColumn(),
  getFloorPriceColumn(),
  getOwnersColumn(),
  getTotalSupplyColumn()
]

export const NftGreyTable = styled(TableWrapper)`
  .table {
    .th {
      background: ${PaletteColors['grey-000']};
    }
    .th,
    .td {
      max-width: 10em;
      min-width: 10em;
    }
  }
`

const HoverRow = styled.div`
  &:hover {
    background: ${PaletteColors['grey-000']};
  }
`

const TrendingCollectionsTable: React.FC<Props> = ({ collections }) => {
  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns: useMemo(() => getTableColumns(), []),
      data: useMemo(() => collections, [collections]),
      disableMultiSort: true,
      disableSortRemove: true,
      initialState: {
        sortBy: [{ desc: true, id: 'stats.one_day_volume' }]
      }
    },
    useSortBy
  )

  return (
    <NftGreyTable>
      <div {...getTableProps({ style: { height: '100%', overflow: 'scroll' } })} className='table'>
        <StickyTableHeader>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <div {...headerGroup.getHeaderGroupProps({})} className='tr'>
              {headerGroup.headers.map((column) => (
                <StickyColumn
                  key={column.key}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className='th'
                  style={column.id === 'name' ? { zIndex: 1 } : {}}
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
                </StickyColumn>
              ))}
            </div>
          ))}
        </StickyTableHeader>
        <div {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <HoverRow key={`row-${row.id}`} {...row.getRowProps()} className='tr'>
                {row.cells.map((cell) => (
                  <StickyColumn
                    style={cell.column.id === 'name' ? { zIndex: 1 } : {}}
                    key={`cell-${cell.row.id}`}
                    {...cell.getCellProps()}
                    className='td'
                  >
                    {cell.render('Cell')}
                  </StickyColumn>
                ))}
              </HoverRow>
            )
          })}
        </div>
      </div>
    </NftGreyTable>
  )
}

type Props = OwnProps & {
  collections: CollectionsQuery['collections']
}

export default TrendingCollectionsTable
