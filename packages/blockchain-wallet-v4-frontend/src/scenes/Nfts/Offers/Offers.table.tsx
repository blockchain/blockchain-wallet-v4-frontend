import React, { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import { IconChevronDownV2, IconChevronUpV2 } from '@blockchain-com/constellation'

import { NftAsset, SeaportRawOrder } from '@core/network/api/nfts/types'
import { HeaderText, HeaderToggle, StickyTableHeader } from 'components/Table'

import {
  getActionColumn,
  getAmountColumn,
  getExpirationColumn,
  getFromColumn,
  getPriceColumn
} from './OffersTableColumns'

const getTableColumns = (
  columns: ('price' | 'amount' | 'from' | 'expiration' | 'action')[],
  defaultEthAddr,
  isOwner: boolean,
  asset?: NftAsset
) =>
  [
    columns.includes('price') ? getPriceColumn() : null,
    columns.includes('amount') ? getAmountColumn() : null,
    columns.includes('expiration') ? getExpirationColumn() : null,
    columns.includes('from') ? getFromColumn() : null,
    columns.includes('action') ? getActionColumn(defaultEthAddr, isOwner, asset) : null
  ].filter(Boolean)

const OffersTable: React.FC<Props> = ({ asset, columns, defaultEthAddr, isOwner, offers }) => {
  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      autoResetExpanded: false,
      autoResetFilters: false,
      autoResetGroupBy: false,
      autoResetPage: false,
      autoResetRowState: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      columns: useMemo(
        () => getTableColumns(columns, defaultEthAddr, isOwner, asset),
        [columns, defaultEthAddr, isOwner, asset]
      ),
      data: useMemo(() => offers, [offers]),
      disableMultiSort: true,
      disableSortRemove: true,
      initialState: {}
    },
    useSortBy
  )

  return (
    <div {...getTableProps()} className='table no-border'>
      <StickyTableHeader>
        {headerGroups.map((headerGroup) => (
          // eslint-disable-next-line react/jsx-key
          <div {...headerGroup.getHeaderGroupProps({})} className='tr'>
            {headerGroup.headers.map((column) => (
              <div
                key={column.key}
                {...column.getHeaderProps(
                  column.getSortByToggleProps({
                    style: {
                      width: column.id === 'price' ? '40%' : `${60 / (columns.length - 1)}%`
                    }
                  })
                )}
                className='th'
              >
                <HeaderText>
                  {column.render('Header')}
                  <div>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <HeaderToggle>
                          <IconChevronDownV2 size='small' label='sort-desc' />
                        </HeaderToggle>
                      ) : (
                        <HeaderToggle>
                          <IconChevronUpV2 size='small' label='sort-asc' />
                        </HeaderToggle>
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
                <div
                  key={`cell-${cell.row.id}`}
                  {...cell.getCellProps({
                    style: {
                      width: cell.column.id === 'price' ? '40%' : `${60 / (columns.length - 1)}%`
                    }
                  })}
                  className='td'
                >
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
  asset?: NftAsset
  columns: ('price' | 'amount' | 'from' | 'expiration' | 'action')[]
  defaultEthAddr: string
  isOwner: boolean
  offers: SeaportRawOrder[]
}

export default OffersTable
