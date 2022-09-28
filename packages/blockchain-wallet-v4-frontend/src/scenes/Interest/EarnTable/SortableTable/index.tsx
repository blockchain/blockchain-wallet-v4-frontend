import React, { ReactElement, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { ButtonCell, ButtonCellProps, Row, TextCell } from '@blockchain-com/constellation'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'

import { CoinType } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import { Props as ParentProps, SuccessStateType } from '..'
import { RewardsTextContainer, StakingTextContainer } from '../EarnTable.model'
import { sortTextCells, TableContainer } from './SortableTable.model'
import { CellProps } from './SortableTable.types'

const SortableTable = ({
  handleClick,
  interestAccountBalance,
  interestEligible,
  interestRates,
  sortedInstruments,
  stakingAccountBalance,
  stakingEligible,
  stakingRates,
  walletCurrency
}: ParentProps & OwnPropsType & SuccessStateType): ReactElement => {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'asset',
        cell: ({ getValue }) => {
          const props = getValue() as CellProps
          return <TextCell {...props} />
        },
        header: ({ header }) => {
          const sort = header.column.getIsSorted()
          const onClick = header.column.getToggleSortingHandler()

          return (
            <TextCell
              sort={sort}
              text={<FormattedMessage defaultMessage='Asset' id='copy.asset' />}
              toggleSort={onClick}
            />
          )
        },
        sortingFn: sortTextCells
      },
      {
        accessorKey: 'balance',
        cell: ({ getValue }) => {
          const props = getValue() as CellProps
          return <TextCell {...props} />
        },
        header: ({ header }) => {
          const sort = header.column.getIsSorted()
          const onClick = header.column.getToggleSortingHandler()

          return (
            <TextCell
              sort={sort}
              text={<FormattedMessage defaultMessage='Balance' id='copy.balance' />}
              toggleSort={onClick}
            />
          )
        },
        sortingFn: sortTextCells
      },
      {
        accessorKey: 'type',
        cell: ({ getValue }) => {
          const props = getValue() as CellProps
          return <TextCell {...props} />
        },
        header: ({ header }) => {
          const sort = header.column.getIsSorted()
          const onClick = header.column.getToggleSortingHandler()

          return (
            <TextCell
              text={<FormattedMessage defaultMessage='Type' id='copy.type' />}
              sort={sort}
              toggleSort={onClick}
            />
          )
        },
        sortingFn: sortTextCells
      },
      {
        accessorKey: 'rates',
        cell: ({ getValue }) => {
          const props = getValue() as CellProps
          return <TextCell {...props} />
        },
        header: ({ header }) => {
          const sort = header.column.getIsSorted()
          const onClick = header.column.getToggleSortingHandler()

          return (
            <TextCell
              sort={sort}
              text={<FormattedMessage defaultMessage='Rates' id='copy.rates' />}
              toggleSort={onClick}
            />
          )
        },
        sortingFn: sortTextCells
      },
      {
        accessorKey: 'actions',
        cell: ({ getValue }) => {
          const props = getValue() as ButtonCellProps
          return <ButtonCell {...props} />
        },
        header: () => (
          <TextCell
            text={<FormattedMessage defaultMessage='Actions' id='copy.actions' />}
            width='content'
          />
        )
      }
    ],
    []
  )

  const data = sortedInstruments
    .filter(({ coin }) => {
      return window.coins[coin]
    })
    .map(({ coin, product }) => {
      const { coinfig } = window.coins[coin] || {}
      const { displaySymbol, name: displayName } = coinfig
      const isStaking = product === 'Staking'
      const account = isStaking
        ? stakingAccountBalance && stakingAccountBalance[coin]
        : interestAccountBalance && interestAccountBalance[coin]
      const accountBalanceBase = account ? account.balance : 0
      const interestEligibleCoin = interestEligible[coin] && interestEligible[coin]?.eligible
      const stakingEligibleCoin = stakingEligible[coin] && stakingEligible[coin]?.eligible
      const rate = isStaking ? stakingRates[coin].rate : interestRates[coin]

      const primaryButton = isStaking
        ? {
            disabled: accountBalanceBase === 0 && !stakingEligibleCoin,
            onClick: () => handleClick(coin, isStaking),
            text:
              accountBalanceBase > 0 ? (
                <FormattedMessage id='copy.manage' defaultMessage='Manage' />
              ) : (
                <FormattedMessage id='copy.stake' defaultMessage='Stake' />
              ),
            variant: accountBalanceBase > 0 ? 'minimal' : 'primary',
            width: 'auto'
          }
        : {
            disabled: accountBalanceBase === 0 && !interestEligibleCoin,
            onClick: () => handleClick(coin, isStaking),
            text:
              accountBalanceBase > 0 ? (
                <FormattedMessage id='copy.manage' defaultMessage='Manage' />
              ) : (
                <FormattedMessage id='copy.add' defaultMessage='Add' />
              ),
            variant: accountBalanceBase > 0 ? 'minimal' : 'primary',
            width: 'auto'
          }

      return {
        actions: {
          primaryButton
        } as ButtonCellProps,
        asset: {
          icon: <Icon name={coin} color={coin} size='32px' />,
          iconPosition: 'left',
          subtext: (
            <Text color='grey700' size='14px' weight={500}>
              {displaySymbol}
            </Text>
          ),
          text: (
            <Text color='grey900' size='14px' weight={500}>
              {displayName}
            </Text>
          ),
          value: displayName
        } as CellProps,
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
        } as CellProps,
        rates: {
          text: `${rate}%`,
          value: rate
        } as CellProps,
        type: {
          text: isStaking ? (
            <StakingTextContainer>
              <Text color='grey900' size='12px' weight={600}>
                {product}
              </Text>
            </StakingTextContainer>
          ) : (
            <RewardsTextContainer>
              <Text color='grey600' size='12px' weight={600}>
                {product}
              </Text>
            </RewardsTextContainer>
          ),
          value: product
        } as CellProps
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

type OwnPropsType = {
  handleClick: (coin: CoinType, isStaking: boolean) => void
}

export default SortableTable
