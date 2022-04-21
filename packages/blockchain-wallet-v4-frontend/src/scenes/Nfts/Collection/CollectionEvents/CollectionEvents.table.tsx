import React, { useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronDown } from '@blockchain-com/icons'

import { HeaderText, HeaderToggle, StickyTableHeader, TableWrapper } from 'components/Table'
import { EventsQuery } from 'generated/graphql'

import { getDateColumn } from './Table/date.column'
import { getEventTypeColumn } from './Table/event_type.column'
import { getFromColumn } from './Table/from.column'
import { getItemColumn } from './Table/item.column'
import { getPriceColumn } from './Table/price.column'
import { getToColumn } from './Table/to.column'

const getTableColumns = () => [
  getEventTypeColumn(),
  getItemColumn(),
  getPriceColumn(),
  getFromColumn(),
  getToColumn(),
  getDateColumn()
]

const CollectionEventsTable: React.FC<Props> = ({ events }) => {
  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      autoResetExpanded: false,
      autoResetFilters: false,
      autoResetGroupBy: false,
      autoResetPage: false,
      autoResetRowState: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      columns: useMemo(() => getTableColumns(), []),
      data: useMemo(() => events, [events]),
      disableMultiSort: true,
      disableSortRemove: true,
      initialState: {}
    },
    useSortBy
  )

  return (
    <div {...getTableProps({ style: { height: 'auto' } })} className='table'>
      <StickyTableHeader>
        {headerGroups.map((headerGroup) => (
          // eslint-disable-next-line react/jsx-key
          <div {...headerGroup.getHeaderGroupProps({})} className='tr'>
            {headerGroup.headers.map((column) => (
              <div
                key={column.key}
                {...column.getHeaderProps(
                  column.getSortByToggleProps({ style: { width: '16.667%' } })
                )}
                className='th'
              >
                <HeaderText>
                  {column.render('Header')}
                  <div>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <HeaderToggle>
                          <Icon label='sort-desc'>
                            <IconChevronDown />
                          </Icon>
                        </HeaderToggle>
                      ) : (
                        <HeaderToggle>
                          <Icon label='sort-asc'>
                            <IconChevronDown />
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
                  {...cell.getCellProps({ style: { width: '16.667%' } })}
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
  events: EventsQuery['events']
}

export default CollectionEventsTable
