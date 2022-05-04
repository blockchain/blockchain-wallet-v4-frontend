import React, { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronDownV2, IconChevronUpV2 } from '@blockchain-com/icons'

import { RawOrder } from '@core/network/api/nfts/types'
import { HeaderText, HeaderToggle, StickyTableHeader } from 'components/Table'

import {
  getAmountColumn,
  getExpirationColumn,
  getFromColumn,
  getOfferCancelColumn,
  getPriceColumn
} from './OffersTableColumns'

const getTableColumns = (
  columns: ('price' | 'amount' | 'from' | 'expiration' | 'cancel_offer')[]
) =>
  [
    columns.includes('price') ? getPriceColumn() : null,
    columns.includes('amount') ? getAmountColumn() : null,
    columns.includes('expiration') ? getExpirationColumn() : null,
    columns.includes('from') ? getFromColumn() : null,
    columns.includes('cancel_offer') ? getOfferCancelColumn() : null
  ].filter(Boolean)

const OffersTable: React.FC<Props> = ({ bidsAndOffers, columns }) => {
  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      autoResetExpanded: false,
      autoResetFilters: false,
      autoResetGroupBy: false,
      autoResetPage: false,
      autoResetRowState: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      columns: useMemo(() => getTableColumns(columns), [columns]),
      data: useMemo(() => bidsAndOffers, [bidsAndOffers]),
      disableMultiSort: true,
      disableSortRemove: true,
      initialState: {}
    },
    useSortBy
  )

  return (
    <div {...getTableProps()} className='table'>
      <StickyTableHeader>
        {headerGroups.map((headerGroup) => (
          // eslint-disable-next-line react/jsx-key
          <div {...headerGroup.getHeaderGroupProps({})} className='tr'>
            {headerGroup.headers.map((column) => (
              <div
                key={column.key}
                {...column.getHeaderProps(
                  column.getSortByToggleProps({ style: { width: `${100 / columns.length}%` } })
                )}
                className='th'
              >
                <HeaderText>
                  {column.render('Header')}
                  <div>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <HeaderToggle>
                          <Icon size='sm' label='sort-desc'>
                            <IconChevronDownV2 />
                          </Icon>
                        </HeaderToggle>
                      ) : (
                        <HeaderToggle>
                          <Icon size='sm' label='sort-asc'>
                            <IconChevronUpV2 />
                          </Icon>
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
                  {...cell.getCellProps({ style: { width: `${100 / columns.length}%` } })}
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
  bidsAndOffers: RawOrder[]
  columns: ('price' | 'amount' | 'from' | 'expiration' | 'cancel_offer')[]
}

export default OffersTable
