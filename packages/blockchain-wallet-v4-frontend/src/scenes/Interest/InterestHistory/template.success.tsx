import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import {
  //   Link,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { SuccessStateType } from '.'
import { Value } from './model'

export const MainTitle = styled(Text)`
  margin-bottom: 8px;
`

function Success(props: SuccessStateType): ReactElement {
  return (
    <div style={{ minWidth: '900px', paddingBottom: '45px' }}>
      <Text
        size="24px"
        weight={600}
        color="grey800"
        style={{ marginBottom: '16px', lineHeight: 1.5 }}
      >
        <FormattedMessage
          id="scenes.earninterest.history.header"
          defaultMessage="History"
        />
      </Text>
      <Table style={{ minWidth: '900px' }}>
        <TableHeader>
          <TableCell width="20%">
            <Text size="12px" weight={500}>
              <FormattedMessage
                id="scenes.earninterest.history.type"
                defaultMessage="Type"
              />
            </Text>
          </TableCell>
          <TableCell width="20%">
            <Text size="12px" weight={500}>
              <FormattedMessage id="copy.date" defaultMessage="Date" />
            </Text>
          </TableCell>
          <TableCell width="20%">
            <Text size="12px" weight={500}>
              <FormattedMessage id="copy.from" defaultMessage="From" />
            </Text>
          </TableCell>
          <TableCell width="20%">
            <Text size="12px" weight={500}>
              <FormattedMessage id="copy.to" defaultMessage="To" />
            </Text>
          </TableCell>
          <TableCell width="20%">
            <Text size="12px" weight={500}>
              <FormattedMessage id="copy.amount" defaultMessage="Amount" />
            </Text>
          </TableCell>
        </TableHeader>
        {props.interestHistory.items.map(transaction => {
          return (
            <TableRow key={transaction.id}>
              <TableCell width="20%">
                <Value data-e2e="interestTransactionType">
                  {transaction.type.toLowerCase()}
                </Value>
              </TableCell>
              <TableCell width="20%">
                <Value data-e2e="interestTransactionDate">
                  {moment(transaction.insertedAt).format('llll')}
                </Value>
              </TableCell>
              <TableCell width="20%">
                <Value data-e2e="interestTransactionFrom">
                  From Placeholder
                </Value>
              </TableCell>
              <TableCell width="20%">
                <Value data-e2e="interestTransactionTo">To Placeholder</Value>
              </TableCell>
              <TableCell width="20%">
                <Value data-e2e="interestTransactionAmount">
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
