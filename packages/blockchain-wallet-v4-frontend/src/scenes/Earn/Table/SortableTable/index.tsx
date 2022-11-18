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

import { Exchange } from '@core'
import { CoinType } from '@core/types'
import { Icon, Text, TooltipHost } from 'blockchain-info-components'
import { RoundedBadge } from 'components/Badge'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import { Props as ParentProps, SuccessStateType } from '..'
import { RewardsTextContainer, StakingTextContainer, Tag } from '../Table.model'
import { sortTextCells, TableContainer } from './SortableTable.model'

const SortableTable = ({
  earnTab,
  handleClick,
  interestAccountBalance,
  interestEligible,
  interestRates,
  isGoldTier,
  searchValue,
  showAvailableAssets,
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
          const props = getValue() as TextCellProps
          return <TextCell {...props} />
        },
        header: ({ header }) => {
          const sort = header.column.getIsSorted()
          const onClick = header.column.getToggleSortingHandler()

          return (
            <TextCell
              isHeader
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
          const props = getValue() as TextCellProps
          return <TextCell {...props} />
        },
        header: ({ header }) => {
          const sort = header.column.getIsSorted()
          const onClick = header.column.getToggleSortingHandler()

          return (
            <TextCell
              isHeader
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
          const props = getValue() as TextCellProps
          return <TextCell {...props} />
        },
        header: ({ header }) => {
          const sort = header.column.getIsSorted()
          const onClick = header.column.getToggleSortingHandler()

          return (
            <TextCell
              isHeader
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
          const props = getValue() as TextCellProps
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
    .filter(({ coin, product }) => {
      switch (earnTab) {
        case 'All':
          break
        case 'Rewards':
          if (product !== earnTab) return false
          break
        case 'Staking':
          if (product !== earnTab) return false
          break

        default:
          break
      }

      if (showAvailableAssets) {
        const isStaking = product === 'Staking'
        const account = isStaking
          ? stakingAccountBalance && stakingAccountBalance[coin]
          : interestAccountBalance && interestAccountBalance[coin]
        const accountBalanceBase = account ? account.balance : 0
        const hasAccountBalance = accountBalanceBase > 0

        if (!hasAccountBalance) return false
      }

      const isCoinInWindow = !!window.coins[coin]

      if (searchValue !== '' && isCoinInWindow) {
        const { displaySymbol, name, symbol } = window.coins[coin].coinfig
        const containsSearchValue = [displaySymbol, name, symbol].some((value) =>
          value.toLowerCase().includes(searchValue.toLowerCase())
        )

        if (!containsSearchValue) return false
      }

      return isCoinInWindow
    })
    .map(({ coin, product, rate }) => {
      const { coinfig } = window.coins[coin] || {}
      const { displaySymbol, name: displayName } = coinfig
      const isStaking = product === 'Staking'
      const account = isStaking
        ? stakingAccountBalance && stakingAccountBalance[coin]
        : interestAccountBalance && interestAccountBalance[coin]
      const accountBalanceBase = account ? account.balance : 0
      const hasAccountBalance = accountBalanceBase > 0
      const isInterestCoinEligible = interestEligible[coin] && interestEligible[coin]?.eligible
      const isStakingCoinEligible = stakingEligible[coin] && stakingEligible[coin]?.eligible
      const earnRate = isStaking ? stakingRates[coin].rate : interestRates[coin]

      const primaryButton = isStaking
        ? {
            disabled: !isGoldTier || (!hasAccountBalance && !isStakingCoinEligible),
            onClick: () => handleClick(coin, isStaking),
            text: hasAccountBalance ? (
              <FormattedMessage id='copy.manage' defaultMessage='Manage' />
            ) : (
              <FormattedMessage id='copy.stake' defaultMessage='Stake' />
            ),
            variant: hasAccountBalance ? 'minimal' : 'primary',
            width: 'auto'
          }
        : {
            disabled: !isGoldTier || (!hasAccountBalance && !isInterestCoinEligible),
            onClick: () => handleClick(coin, isStaking),
            text: hasAccountBalance ? (
              <FormattedMessage id='copy.manage' defaultMessage='Manage' />
            ) : (
              <FormattedMessage id='copy.add' defaultMessage='Add' />
            ),
            variant: hasAccountBalance ? 'minimal' : 'primary',
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
          tag: isStaking ? (
            <RoundedBadge>
              <FormattedMessage defaultMessage='New' id='copy.new' />
            </RoundedBadge>
          ) : undefined,
          tagPosition: isStaking ? 'right' : undefined,
          text: (
            <Text color='grey900' size='14px' weight={500}>
              {displayName}
            </Text>
          ),
          value: displayName
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
          ),
          value: Number(
            Exchange.convertCoinToFiat({
              coin,
              currency: walletCurrency,
              rates: rate,
              value: accountBalanceBase
            })
          )
        } as TextCellProps,
        rates: {
          text: hasAccountBalance ? (
            <Tag>
              <FormattedMessage
                defaultMessage='Earning {earnRate}%'
                id='scene.earn.earnrate'
                values={{ earnRate }}
              />
            </Tag>
          ) : (
            `${earnRate}%`
          ),
          value: earnRate
        } as TextCellProps,
        type: {
          text: isStaking ? (
            <TooltipHost id='earntable.staking.tooltip'>
              <StakingTextContainer>
                <Text color='grey900' size='12px' weight={600}>
                  {product}
                </Text>
              </StakingTextContainer>
            </TooltipHost>
          ) : (
            <TooltipHost id='earntable.rewards.tooltip'>
              <RewardsTextContainer>
                <Text color='grey600' size='12px' weight={600}>
                  {product}
                </Text>
              </RewardsTextContainer>
            </TooltipHost>
          ),
          value: product
        } as TextCellProps
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
