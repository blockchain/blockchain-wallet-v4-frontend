import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import {
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
const InterestTableCell = styled(TableCell)`
  align-items: center;
  > ${Value} {
    margin-left: 20px;
  }
`

function Success (props: SuccessStateType): ReactElement {
  const { interestHistory, supportedCoins } = props
  // ToDo: array of coins to supported Coins so I can make it any
  const { coinTicker, colorCode } = supportedCoins.BTC
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
              <InterestTableCell width='20%'>
                {transaction.type === 'WITHDRAWAL' ? (
                  <React.Fragment>
                    <IconBackground>
                      <Icon
                        name='arrow-up'
                        color={colorCode}
                        size='18px'
                        weight={600}
                      />
                    </IconBackground>
                    <Value>{coinTicker} Withdraw</Value>
                  </React.Fragment>
                ) : transaction.type === 'DEPOSIT' ? (
                  <React.Fragment>
                    <IconBackground>
                      <Icon
                        name='arrow-down'
                        color={colorCode}
                        size='18px'
                        weight={600}
                      />
                    </IconBackground>
                    <Value>{coinTicker} Deposit</Value>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Icon name='savings-icon' color={colorCode} size='32px' />
                    <Value>{coinTicker} Interest Earned</Value>
                  </React.Fragment>
                )}
              </InterestTableCell>
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
