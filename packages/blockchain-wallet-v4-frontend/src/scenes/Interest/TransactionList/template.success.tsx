import { flatten, last, map } from 'ramda'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { Exchange, Remote } from 'core'
import {
  HeartbeatLoader,
  Icon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import { InterestTransactionType } from 'core/types'

import {
  AmountTableCell,
  CoinAmountWrapper,
  ErrorTag,
  FiatAmountWrapper,
  IconBackground,
  InterestTableCell,
  PendingTag,
  Value,
  ViewTransaction
} from './model'
import { Props as OwnProps, SuccessStateType } from '.'

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
`
const Container = styled.div`
  min-width: 900px;
  padding-bottom: 45px;
`

function TransactionList (props: Props): ReactElement | null {
  const { interestActions, txPages, supportedCoins, walletCurrency } = props
  const txList = flatten(
    txPages &&
      // @ts-ignore
      txPages.map(pages => map(page => page, (pages && pages.data) || []))
  )
  return txList && txList.length > 0 ? (
    <Container style={{ minWidth: '900px', paddingBottom: '45px' }}>
      <Text
        size='24px'
        weight={600}
        color='grey800'
        style={{ marginBottom: '16px', lineHeight: 1.5 }}
      >
        <FormattedMessage
          id='scenes.interest.history.header'
          defaultMessage='History'
        />
      </Text>
      <Table style={{ minWidth: '900px' }}>
        <TableHeader>
          <TableCell width='20%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.interest.history.type'
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
        {txList.map((tx: InterestTransactionType) => {
          const { amount, extraAttributes, id, insertedAt, state, type } = tx
          const { coinTicker, colorCode, displayName } = supportedCoins[
            amount.symbol
          ]
          return (
            <TableRow key={id}>
              <InterestTableCell width='20%'>
                {type === 'WITHDRAWAL' ? (
                  <React.Fragment>
                    <IconBackground color={`${colorCode}-light`}>
                      <Icon
                        name='arrow-up'
                        color={colorCode}
                        size='20px'
                        weight={600}
                        data-e2e={id}
                      />
                    </IconBackground>
                    <Value data-e2e='withdrawalTx'>{coinTicker} Withdraw</Value>
                    {state === 'REJECTED' || state === 'FAILED' ? (
                      <ErrorTag>
                        <FormattedMessage
                          id='copy.failed'
                          defaultMessage='Failed'
                        />
                      </ErrorTag>
                    ) : state === 'REFUNDED' ? (
                      <PendingTag>
                        <FormattedMessage
                          id='copy.refunded'
                          defaultMessage='Refunded'
                        />
                      </PendingTag>
                    ) : state !== 'COMPLETE' ? (
                      <PendingTag>
                        <FormattedMessage
                          id='copy.pending'
                          defaultMessage='Pending'
                        />
                      </PendingTag>
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                ) : type === 'DEPOSIT' ? (
                  <React.Fragment>
                    <IconBackground color={`${colorCode}-light`}>
                      <Icon
                        name='arrow-down'
                        color={colorCode}
                        size='20px'
                        weight={600}
                      />
                    </IconBackground>

                    <Value data-e2e='depositTx'>{coinTicker} Transfer</Value>
                    {state === 'REJECTED' || state === 'FAILED' ? (
                      <ErrorTag>
                        <FormattedMessage
                          id='copy.failed'
                          defaultMessage='Failed'
                        />
                      </ErrorTag>
                    ) : state === 'REFUNDED' ? (
                      <PendingTag>
                        <FormattedMessage
                          id='copy.refunded'
                          defaultMessage='Refunded'
                        />
                      </PendingTag>
                    ) : state !== 'COMPLETE' ? (
                      <PendingTag>
                        <FormattedMessage
                          id='copy.pending'
                          defaultMessage='Pending'
                        />
                      </PendingTag>
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Icon name='percentage' color={colorCode} size='32px' />
                    <Value data-e2e='interestEarnedTx'>
                      {coinTicker} Interest Earned
                    </Value>
                  </React.Fragment>
                )}
              </InterestTableCell>
              <TableCell width='20%'>
                <Value data-e2e='interestTransactionDate'>
                  {moment(insertedAt)
                    .local()
                    .format('MMMM D YYYY @ h:mm A')}
                </Value>
              </TableCell>
              {type === 'DEPOSIT' ? (
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
              ) : type === 'WITHDRAWAL' ? (
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
                  <CoinAmountWrapper
                    coin={amount.symbol}
                    color='grey800'
                    weight={600}
                    data-e2e='interestTxCoinAmount'
                    size='14px'
                    style={{ marginBottom: '4px', lineHeight: '1.5' }}
                  >
                    {
                      Exchange.convertCoinToCoin({
                        value: amount.value,
                        coin: amount.symbol,
                        baseToStandard: false
                      }).value
                    }
                  </CoinAmountWrapper>
                  <FiatAmountWrapper
                    color='grey600'
                    coin={amount.symbol}
                    currency={walletCurrency}
                    data-e2e='interestTxFiatAmount'
                    size='12px'
                    style={{ alignItems: 'right' }}
                    weight={500}
                  >
                    {
                      Exchange.convertCoinToCoin({
                        value: amount.value,
                        coin: amount.symbol,
                        baseToStandard: false
                      }).value
                    }
                  </FiatAmountWrapper>
                  {type === 'DEPOSIT' && (
                    <ViewTransaction
                      data-e2e='viewTxHash'
                      onClick={() =>
                        interestActions.routeToTxHash(
                          amount.symbol,
                          extraAttributes.hash
                        )
                      }
                    >
                      View Transaction
                    </ViewTransaction>
                  )}
                  {type === 'WITHDRAWAL' && state === 'COMPLETE' && (
                    <ViewTransaction
                      data-e2e='viewTxHash'
                      onClick={() =>
                        interestActions.routeToTxHash(
                          amount.symbol,
                          extraAttributes.txHash
                        )
                      }
                    >
                      View Transaction
                    </ViewTransaction>
                  )}
                </div>
              </AmountTableCell>
            </TableRow>
          )
        })}
      </Table>
      {Remote.Loading.is(last(txPages)) && (
        <LoadingWrapper>
          <HeartbeatLoader />
        </LoadingWrapper>
      )}
    </Container>
  ) : null
}

type Props = OwnProps & SuccessStateType

export default TransactionList
