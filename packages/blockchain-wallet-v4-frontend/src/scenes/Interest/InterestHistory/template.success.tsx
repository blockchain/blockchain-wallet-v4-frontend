import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import {
  //   Link,
  Icon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import { IconBackground, Value } from './model'
import { SuccessStateType } from '.'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

export const MainTitle = styled(Text)`
  margin-bottom: 8px;
`

function Success (props: SuccessStateType): ReactElement {
  const { interestHistory, supportedCoins } = props
  // how do i pass array of coins to supported Coins so I can make it any
  const { colorCode } = supportedCoins.BTC
  return (
    <div style={{ minWidth: '900px', paddingBottom: '45px' }}>
      <Text
        size='24px'
        weight={600}
        color='grey800'
        style={{ marginBottom: '16px', lineHeight: 1.5 }}
      >
        <FormattedMessage
          id='scenes.earninterest.history.header'
          defaultMessage='History'
        />
      </Text>
      <Table style={{ minWidth: '900px' }}>
        <TableHeader>
          <TableCell width='20%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.earninterest.history.type'
                defaultMessage='Type'
              />
            </Text>
          </TableCell>
          <TableCell width='20%'>
            <Text size='12px' weight={500}>
              <FormattedMessage id='copy.date' defaultMessage='Date' />
            </Text>
          </TableCell>
          <TableCell width='20%'>
            <Text size='12px' weight={500}>
              <FormattedMessage id='copy.from' defaultMessage='From' />
            </Text>
          </TableCell>
          <TableCell width='20%'>
            <Text size='12px' weight={500}>
              <FormattedMessage id='copy.to' defaultMessage='To' />
            </Text>
          </TableCell>
          <TableCell width='20%'>
            <Text size='12px' weight={500}>
              <FormattedMessage id='copy.amount' defaultMessage='Amount' />
            </Text>
          </TableCell>
        </TableHeader>
        {interestHistory.items.map(transaction => {
          return (
            <TableRow key={transaction.id}>
              <TableCell width='20%'>
                <IconBackground>
                  <Icon name='arrow-down' size='18px' color={colorCode} />
                </IconBackground>
                <Value data-e2e='interestTransactionType'>
                  {transaction.type}
                </Value>
              </TableCell>
              <TableCell width='20%'>
                <Value data-e2e='interestTransactionDate'>
                  {moment(transaction.insertedAt).format('llll')}
                </Value>
              </TableCell>
              <TableCell width='20%'>
                <Value data-e2e='interestTransactionFrom'>
                  From Placeholder
                </Value>
              </TableCell>
              <TableCell width='20%'>
                <Value data-e2e='interestTransactionTo'>To Placeholder</Value>
              </TableCell>
              <TableCell width='20%'>
                <Value data-e2e='interestTransactionAmount'>
                  {transaction.amount.value} {transaction.amount.symbol}
                </Value>
              </TableCell>
            </TableRow>
          )
        })}
      </Table>
    </div>
  )
}

export default Success
