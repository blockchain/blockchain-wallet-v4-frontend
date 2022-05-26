import React, { ReactNode, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Flex } from 'components/Flex'
import { useCoinTransactionsQuery, useOpenTransactionReportModal } from 'hooks'

import { Header } from '../../../ActivityFeedCard/components'
import { TransactionListItem } from '../../../TransactionListItem'
import { ActivityFeedHook } from './useActivityFeed.types'

const useActivityFeed: ActivityFeedHook = ({ coin }) => {
  const { data: transactions } = useCoinTransactionsQuery({ coin })
  const [openDownloadModal] = useOpenTransactionReportModal()

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
        </Header>

        <Card>
          <Flex flexDirection='column'>
            {transactions?.map((transaction) => (
              <TransactionListItem
                key={transaction.toString()}
                transaction={transaction}
                coin={coin}
              />
            ))}
          </Flex>
        </Card>
      </Flex>
    )
  }, [transactions, coin])

  return [activityFeedNode]
}

export default useActivityFeed
