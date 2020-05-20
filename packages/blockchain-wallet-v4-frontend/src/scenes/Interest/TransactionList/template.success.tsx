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

function TransactionList (props: Props): ReactElement | null {
  const {
    btcRates,
    coin,
    interestActions,
    txPages,
    supportedCoins,
    walletCurrency
  } = props
  const txList = flatten(
    txPages &&
      // @ts-ignore
      txPages.map(pages => map(page => page, (pages && pages.data) || []))
  )
  const { coinTicker, colorCode, displayName } = supportedCoins[coin]
  return txList && txList.length > 0 ? (
    <div style={{ minWidth: '900px', paddingBottom: '45px' }}>
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
          return (
            <TableRow key={id}>
              <InterestTableCell width='20%'>
                {type === 'WITHDRAWAL' ? (
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
                    {state === 'PENDING' && (
                      <PendingTag>
                        <FormattedMessage
                          id='copy.pending'
                          defaultMessage='Pending'
                        />
                      </PendingTag>
                    )}
                  </React.Fragment>
                ) : type === 'DEPOSIT' ? (
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
                    {state === 'PENDING' && (
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
                    <Icon name='percentage' color={colorCode} size='32px' />
                    <Value>{coinTicker} Interest Earned</Value>
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
                  <FiatAmountWrapper
                    color='grey800'
                    coin={amount.symbol}
                    currency={walletCurrency}
                    data-e2e='interestTxFiatAmount'
                    rates={btcRates}
                    size='14px'
                    style={{ marginBottom: '4px', alignItems: 'right' }}
                    weight={600}
                  >
                    {
                      Exchange.convertCoinToCoin({
                        value: amount.value,
                        coin: amount.symbol,
                        baseToStandard: false
                      }).value
                    }
                  </FiatAmountWrapper>
                  <CoinAmountWrapper
                    coin={amount.symbol}
                    color='grey600'
                    weight={500}
                    data-e2e='interestTxCoinAmount'
                    size='13px'
                    style={{ lineHeight: '1.5' }}
                  >
                    {
                      Exchange.convertCoinToCoin({
                        value: amount.value,
                        coin: amount.symbol,
                        baseToStandard: false
                      }).value
                    }
                  </CoinAmountWrapper>
                  {type !== 'INTEREST_OUTGOING' && (
                    <ViewTransaction
                      data-e2e='viewTxHash'
                      onClick={() =>
                        interestActions.routeToTxHash(
                          coin,
                          extraAttributes.hash
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
    </div>
  ) : null
}

type Props = OwnProps & SuccessStateType

export default TransactionList
