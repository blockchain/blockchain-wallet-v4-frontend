import React, { ReactElement, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  ButtonCell,
  ButtonCellProps,
  Row,
  SemanticColors,
  Text,
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
import { Icon } from 'blockchain-info-components'
import { RoundedBadge } from 'components/Badge'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { EarnProductsType } from 'data/types'

import { Props as ParentProps, SuccessStateType } from '..'
import Tag from '../Tag'
import { sortTextCells } from './SortableTable.model'
import { ButtonContainer, TableContainer } from './SortableTable.styles'

const SortableTable = ({
  activeRewardsAccountBalance,
  activeRewardsEligible,
  activeRewardsRates,
  handleClick,
  interestEligible,
  interestRates,
  isGoldTier,
  passiveRewardsAccountBalance,
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

  const data = sortedInstruments.map(({ coin, product, rate }) => {
    const { coinfig } = window.coins[coin] || {}
    const { displaySymbol, name: displayName } = coinfig
    let account
    let earnRate
    let isCoinEligible
    let showNewTag = false
    let isActiveRewards = false

    switch (product) {
      case 'Staking':
        account = stakingAccountBalance && stakingAccountBalance[coin]
        earnRate = stakingRates[coin].rate
        isCoinEligible = stakingEligible[coin]?.eligible
        showNewTag = true
        break
      case 'Active':
        account = activeRewardsAccountBalance && activeRewardsAccountBalance[coin]
        earnRate = activeRewardsRates[coin].rate
        isCoinEligible = activeRewardsEligible[coin]?.eligible
        showNewTag = true
        isActiveRewards = true
        break
      case 'Passive':
      default:
        account = passiveRewardsAccountBalance && passiveRewardsAccountBalance[coin]
        earnRate = interestRates[coin]
        isCoinEligible = interestEligible[coin]?.eligible
        break
    }

    const accountBalanceBase = account ? account.balance : 0
    const hasAccountBalance = accountBalanceBase > 0

    const balanceText: TextCellProps = hasAccountBalance
      ? {
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
        }
      : {
          text: (
            <Tag backgroundColor='background-light'>
              <Text color={SemanticColors.title} variant='caption2'>
                <FormattedMessage
                  defaultMessage='Start earning'
                  id='scenes.earn.table.start-earning'
                />
              </Text>
            </Tag>
          )
        }

    const primaryButton = {
      disabled: !isGoldTier || (!hasAccountBalance && !isCoinEligible),
      onClick: () => handleClick(coin, product),
      text: (
        <ButtonContainer>
          {hasAccountBalance ? (
            <Text color={SemanticColors.primary} variant='paragraph1'>
              <FormattedMessage id='copy.manage' defaultMessage='Manage' />
            </Text>
          ) : (
            <Text color={SemanticColors.background} variant='paragraph1'>
              <FormattedMessage
                id='scenes.earn.table.sortable.button.get-started'
                defaultMessage='Get started'
              />
            </Text>
          )}
        </ButtonContainer>
      ),
      variant: hasAccountBalance ? 'minimal' : 'primary',
      width: 'content'
    }

    return {
      actions: {
        primaryButton
      } as ButtonCellProps,
      asset: {
        icon: <Icon name={coin} color={coin} size='32px' />,
        iconPosition: 'left',
        subtext: (
          <Text color={SemanticColors.body} variant='paragraph1'>
            {displaySymbol}
          </Text>
        ),
        tag: showNewTag ? (
          <RoundedBadge>
            <FormattedMessage defaultMessage='New' id='copy.new' />
          </RoundedBadge>
        ) : undefined,
        tagPosition: showNewTag ? 'right' : undefined,
        text: (
          <Text color={SemanticColors.title} variant='paragraph1'>
            {displayName}
          </Text>
        ),
        value: displayName
      } as TextCellProps,
      balance: {
        ...balanceText,
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
          <Tag backgroundColor='background-green'>
            <Text color={SemanticColors.success} variant='caption2'>
              {isActiveRewards ? (
                <FormattedMessage
                  defaultMessage='Earning up to {earnRate}%'
                  id='scene.earn.earnrate-upto'
                  values={{ earnRate }}
                />
              ) : (
                <FormattedMessage
                  defaultMessage='Earning {earnRate}%'
                  id='scene.earn.earnrate'
                  values={{ earnRate }}
                />
              )}
            </Text>
          </Tag>
        ) : (
          <Text color={SemanticColors.title} variant='caption1'>
            {`${earnRate}%`}
          </Text>
        ),
        value: earnRate
      } as TextCellProps,
      type: {
        text: (
          <Tag backgroundColor='background' borderColor='background-light'>
            <Text color={SemanticColors.body} variant='caption2'>
              <FormattedMessage
                defaultMessage='{product} Rewards'
                id='scenes.earn.table.type'
                values={{
                  product
                }}
              />
            </Text>
          </Tag>
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
  handleClick: (coin: CoinType, product: EarnProductsType) => void
}

export default SortableTable
