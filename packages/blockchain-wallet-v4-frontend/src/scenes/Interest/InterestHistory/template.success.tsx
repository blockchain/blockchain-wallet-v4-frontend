import { FormattedMessage } from 'react-intl'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import {
  Icon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import { IconBackground, PendingTag, Value } from './model'
import { SuccessStateType } from '.'
import moment from 'moment'
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
  const { coin, interestHistory, supportedCoins } = props
  const { coinTicker, colorCode } = supportedCoins[coin]
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
                    {transaction.state === 'PENDING' && (
                      <PendingTag>
                        <FormattedMessage
                          id='copy.pending'
                          defaultMessage='Pending'
                        />
                      </PendingTag>
                    )}
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
                    {transaction.state === 'PENDING' && (
                      <PendingTag>
                        <FormattedMessage
                          id='copy.pending'
                          defaultMessage='Pending'
                        />
                      </PendingTag>
                    )}
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
                <div>
                  <FiatDisplay
                    color='grey800'
                    size='14px'
                    weight={600}
                    coin={coin}
                    style={{ marginBottom: '4px' }}
                    data-e2e='interestFiatAmount'
                  >
                    {transaction.amount.value}
                  </FiatDisplay>
                  <CoinDisplay
                    coin={coin}
                    color='grey600'
                    weight={500}
                    data-e2e='interestCoinAmount'
                    size='13px'
                    style={{ lineHeight: '1.5' }}
                  >
                    {transaction.amount.value}
                  </CoinDisplay>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </Table>
    </div>
  )
}

export default Success
