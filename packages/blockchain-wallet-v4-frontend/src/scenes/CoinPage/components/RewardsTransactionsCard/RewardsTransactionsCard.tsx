import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

import { Button, Text } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { RewardsTransactionsCardComponent } from './RewardsTransactionsCard.types'

const RewardsTransactionsCard: RewardsTransactionsCardComponent = () => {
  return (
    <Card borderWidth={1} borderRadius='lg'>
      <Padding all={48}>
        <Flex flexDirection='column' alignItems='center' justifyContent='center' gap={16}>
          <Flex flexDirection='column' alignItems='center' justifyContent='center' gap={8}>
            <Text size='20px' weight={600} color='grey900'>
              <FormattedMessage
                id='scenes.interest.interestaccount'
                defaultMessage='Rewards Account'
              />
            </Text>

            <Text size='16px' weight={400} color='grey600'>
              <FormattedMessage
                id='scenes.transaction.interest.view_txs'
                defaultMessage='Visit the Earn Rewards page to view your transaction history.'
              />
            </Text>
          </Flex>

          <NavLink
            style={{ textDecoration: 'none' }}
            to='/earn/history'
            data-e2e='visitEarnEarnPage'
          >
            <Button data-e2e='viewInterestTransaction' nature='primary' height='48px' size='16px'>
              <FormattedMessage id='copy.viewTransactions' defaultMessage='View Transactions' />
            </Button>
          </NavLink>
        </Flex>
      </Padding>
    </Card>
  )
}

export default RewardsTransactionsCard
