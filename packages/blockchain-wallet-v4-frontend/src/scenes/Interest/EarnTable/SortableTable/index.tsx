import React, { ReactElement, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  ButtonCell,
  ButtonCellProps,
  Row,
  TextCell,
  TextCellProps
} from '@blockchain-com/constellation'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'

import { Icon } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Analytics } from 'data/types'

import { Props as OwnProps, SuccessStateType } from '..'
import { sortTextCells, TableContainer } from './SortableTable.model'

const SortableTable = ({
  analyticsActions,
  interestAccountBalance,
  interestActions,
  interestEligible,
  interestRate,
  sortedInstruments,
  walletCurrency
}: OwnProps & SuccessStateType): ReactElement => {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'asset',
        cell: ({ getValue }) => {
          const props = getValue() as TextCellProps
          return <TextCell {...props} />
        },
        header: ({ header }) => {
          const sort = header.column.getIsSorted()
          const onClick = header.column.getToggleSortingHandler()

          return <TextCell text='Asset' sort={sort} toggleSort={onClick} />
        },
        sortingFn: sortTextCells
      },
      {
        accessorKey: 'balance',
        cell: ({ getValue }) => {
          const props = getValue() as TextCellProps
          return <TextCell {...props} />
        },
        header: ({ header }) => {
          const sort = header.column.getIsSorted()
          const onClick = header.column.getToggleSortingHandler()

          return <TextCell subtext='Balance' sort={sort} toggleSort={onClick} />
        },
        sortingFn: sortTextCells
      },
      {
        accessorKey: 'type',
        cell: ({ getValue }) => {
          const props = getValue() as TextCellProps
          return <TextCell {...props} />
        },
        header: ({ header }) => {
          const sort = header.column.getIsSorted()
          const onClick = header.column.getToggleSortingHandler()

          return <TextCell subtext='Type' sort={sort} toggleSort={onClick} />
        },
        sortingFn: sortTextCells
      },
      {
        accessorKey: 'apy',
        cell: ({ getValue }) => {
          const props = getValue() as TextCellProps
          return <TextCell {...props} />
        },
        header: ({ header }) => {
          const sort = header.column.getIsSorted()
          const onClick = header.column.getToggleSortingHandler()

          return <TextCell subtext='APY' sort={sort} toggleSort={onClick} />
        },
        sortingFn: sortTextCells
      },
      {
        accessorKey: 'actions',
        cell: ({ getValue }) => {
          const props = getValue() as ButtonCellProps
          return <ButtonCell {...props} />
        },
        header: () => <TextCell subtext='Actions' width='content' />
      }
    ],
    []
  )

  const data = sortedInstruments
    .filter((instrument) => {
      return window.coins[instrument]
    })
    .map((coin) => {
      const { coinfig } = window.coins[coin] || {}
      const { displaySymbol, name: displayName } = coinfig
      const account = interestAccountBalance && interestAccountBalance[coin]
      const accountBalanceBase = account ? account.balance : 0
      const interestEligibleCoin = interestEligible[coin] && interestEligible[coin]?.eligible

      const handleClick = () => {
        analyticsActions.trackEvent({
          key: Analytics.WALLET_REWARDS_DETAIL_CLICKED,
          properties: {
            currency: coin
          }
        })
        interestActions.showInterestModal({ coin, step: 'ACCOUNT_SUMMARY' })
      }

      return {
        actions: {
          primaryButton: {
            disabled: !interestEligibleCoin,
            onClick: handleClick,
            text:
              accountBalanceBase > 0 ? (
                <FormattedMessage id='copy.manage' defaultMessage='Manage' />
              ) : (
                <FormattedMessage id='copy.add' defaultMessage='Add' />
              ),
            variant: accountBalanceBase > 0 ? 'minimal' : 'primary',
            width: 'auto'
          }
        } as ButtonCellProps,
        apy: { text: `${interestRate[coin]}%` } as TextCellProps,
        asset: {
          icon: <Icon name={coin} color={coin} size='32px' />,
          iconPosition: 'left',
          subtext: displaySymbol,
          text: displayName
        } as TextCellProps,
        balance: {
          subtext: (
            <CoinDisplay
              coin={coin}
              size='14px'
              color='grey700'
              cursor='inherit'
              weight={500}
              data-e2e={`${displaySymbol}Balance`}
            >
              {accountBalanceBase}
            </CoinDisplay>
          ),
          text: (
            <FiatDisplay
              color='grey900'
              coin={coin}
              currency={walletCurrency}
              loadingHeight='24px'
              size='14px'
              style={{ lineHeight: '21px' }}
              weight={500}
            >
              {accountBalanceBase}
            </FiatDisplay>
          )
        } as TextCellProps,
        type: {
          text: 'Rewards'
        }
      }
    })

  const table = useReactTable({
    // @ts-ignore
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  })

  return (
    <TableContainer>
      {table.getHeaderGroups().map((headerGroup) => (
        <Row key={headerGroup.id} header>
          {headerGroup.headers.map((header) => {
            return flexRender(header.column.columnDef.header, {
              ...header.getContext(),
              key: header.id
            })
          })}
        </Row>
      ))}
      <tbody>
        {table.getRowModel().rows.map((row) => {
          return (
            <Row key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return flexRender(cell.column.columnDef.cell, {
                  ...cell.getContext(),
                  key: cell.id
                })
              })}
            </Row>
          )
        })}
      </tbody>
    </TableContainer>
  )
}

export default SortableTable
