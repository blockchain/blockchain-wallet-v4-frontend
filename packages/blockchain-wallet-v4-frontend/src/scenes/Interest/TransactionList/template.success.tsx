import {
  AmountTableCell,
  CoinAmountWrapper,
  FiatAmountWrapper,
  IconBackground,
  InterestTableCell,
  PendingTag,
  Value,
  ViewTransaction
} from './model'
import { FormattedMessage } from 'react-intl'
import {
  Icon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import { Props as OwnProps, SuccessStateType } from '.'
import moment from 'moment'
import React, { ReactElement } from 'react'

function TransactionList (props: Props): ReactElement {
  const { coin, interestHistory, supportedCoins } = props
  const { coinTicker, colorCode, displayName } = supportedCoins[coin]

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
          <AmountTableCell width='20%'>
            <Text size='12px' weight={500}>
              <FormattedMessage id='copy.amount' defaultMessage='Amount' />
            </Text>
          </AmountTableCell>
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
                        size='20px'
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
                        size='20px'
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
              {transaction.type === 'DEPOSIT' ? (
                <React.Fragment>
                  <TableCell width='20%'>
                    <Value data-e2e='interestTransactionFrom'>
                      My {displayName} Wallet
                    </Value>
                  </TableCell>
                  <TableCell width='20%'>
                    <Value data-e2e='interestTransactionTo'>
                      {displayName} Interest Account
                    </Value>
                  </TableCell>
                </React.Fragment>
              ) : transaction.type === 'WITHDRAWAL' ? (
                <React.Fragment>
                  <TableCell width='20%'>
                    <Value data-e2e='interestTransactionFrom'>
                      {displayName} Interest Account
                    </Value>
                  </TableCell>
                  <TableCell width='20%'>
                    <Value data-e2e='interestTransactionTo'>
                      My {displayName} Wallet
                    </Value>
                  </TableCell>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <TableCell width='20%'>
                    <Value data-e2e='interestTransactionFrom'>
                      Blockchain.com
                    </Value>
                  </TableCell>
                  <TableCell width='20%'>
                    <Value data-e2e='interestTransactionTo'>
                      {displayName} Interest Account
                    </Value>
                  </TableCell>
                </React.Fragment>
              )}

              <AmountTableCell width='20%'>
                <div>
                  <FiatAmountWrapper
                    color='grey800'
                    size='14px'
                    weight={600}
                    coin={coin}
                    style={{ marginBottom: '4px', alignItems: 'right' }}
                    data-e2e='interestFiatAmount'
                  >
                    {transaction.amount.value}
                  </FiatAmountWrapper>
                  <CoinAmountWrapper
                    coin={coin}
                    color='grey600'
                    weight={500}
                    data-e2e='interestCoinAmount'
                    size='13px'
                    style={{ lineHeight: '1.5' }}
                  >
                    {transaction.amount.value}
                  </CoinAmountWrapper>
                  <ViewTransaction
                    data-e2e='viewTxHash'
                    onClick={() =>
                      props.interestActions.routeToTxHash(
                        coin,
                        transaction.extraAttributes.txHash
                      )
                    }
                  >
                    View Transaction
                  </ViewTransaction>
                </div>
              </AmountTableCell>
            </TableRow>
          )
        })}
      </Table>
    </div>
  )
}

type Props = OwnProps & SuccessStateType

export default TransactionList
