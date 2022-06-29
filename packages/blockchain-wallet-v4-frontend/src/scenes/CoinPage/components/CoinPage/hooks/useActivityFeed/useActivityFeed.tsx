import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import { Card } from 'components/Card'
import EmptyResults from 'components/EmptyResults'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'
import { useCoinTransactionsQuery, useOpenTransactionReportModal, useWalletsForCoin } from 'hooks'

import { AccountSelectBox, AccountSelectBoxItem } from '../../../AccountSelectBox'
import { Header } from '../../../ActivityFeedCard/components'
import { RewardsTransactionsCard } from '../../../RewardsTransactionsCard'
import { TransactionListItem } from '../../../TransactionListItem'
import { ActivityFeedHook, ActivityFilters } from './useActivityFeed.types'
import { filterTransactionsByWalletType } from './utils'

const useActivityFeed: ActivityFeedHook = ({ coin }) => {
  const [walletFilter, setWalletFilter] = useState<ActivityFilters | undefined>()
  const { data: transactions } = useCoinTransactionsQuery({ coin })
  const [openDownloadModal] = useOpenTransactionReportModal()

  const { data: wallets, isLoading: isLoadingAddressData } = useWalletsForCoin({ coin })

  const filterOptions: AccountSelectBoxItem[] = useMemo(() => {
    return (wallets || []).map((wallet) => ({
      text: wallet.label,
      value: wallet.type
    }))
  }, [wallets])

  const transactionsList = useMemo(() => {
    if (!transactions) return null

    if (walletFilter === 'INTEREST') {
      return <RewardsTransactionsCard />
    }

    const filteredTransactions = walletFilter
      ? filterTransactionsByWalletType(transactions, walletFilter)
      : transactions

    if (filteredTransactions.length === 0) {
      return (
        <Card>
          <Padding all={32}>
            <EmptyResults />
          </Padding>
        </Card>
      )
    }

    return (
      <Card>
        <Flex flexDirection='column'>
          {filteredTransactions?.map((transaction) => (
            <TransactionListItem
              key={JSON.stringify(transaction)}
              transaction={transaction}
              coin={coin}
            />
          ))}
        </Flex>
      </Card>
    )
  }, [walletFilter, transactions, coin])

  const handleOnSelectWalletFilter = useCallback(
    (selectWalletFilter) => {
      setWalletFilter((currentWalletFilter) => {
        if (currentWalletFilter === selectWalletFilter) {
          return undefined
        }

        return selectWalletFilter
      })
    },
    [setWalletFilter]
  )

  const activityFeedNode: ReactNode = useMemo(() => {
    return (
      <Flex flexDirection='column' gap={24}>
        <Header>
          <Button
            data-e2e='download'
            nature='empty-blue'
            onClick={() =>
              openDownloadModal({
                coin,
                origin: 'TransactionList'
              })
            }
          >
            <FormattedMessage
              id='scenes.coinPage.activityFeed.downloadButton.label'
              defaultMessage='Download'
            />
          </Button>

          {!isLoadingAddressData && (
            <AccountSelectBox
              label={
                <FormattedMessage
                  id='scene.coinView.activitySection.accountDropdownLable'
                  defaultMessage='All Accounts'
                />
              }
              value={walletFilter}
              onChange={handleOnSelectWalletFilter}
              items={filterOptions}
            />
          )}
        </Header>

        {transactionsList}
      </Flex>
    )
  }, [
    transactionsList,
    coin,
    isLoadingAddressData,
    filterOptions,
    handleOnSelectWalletFilter,
    openDownloadModal,
    walletFilter
  ])

  return [activityFeedNode]
}

export default useActivityFeed
