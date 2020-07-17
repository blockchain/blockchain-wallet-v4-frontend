import {
  CoinType,
  FiatType,
  ProcessedTxType,
  RemoteDataType,
  SBOrderType,
  SBTransactionType
} from 'core/types'
import DataError from 'components/DataError'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import FiatTxListItem from './template.fiattx'
import Loading from './template.loading'
import SimpleBuyListItem from './template.sborder'
import TransactionListItem from 'components/TransactionListItem'

const TransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  &:last-child {
    > div {
      border: none;
    }
  }
`

class TransactionList extends PureComponent<Props> {
  render () {
    const { coin, coinTicker, currency, data } = this.props

    return data.cata({
      Success: (
        transactions: Array<SBOrderType | SBTransactionType | ProcessedTxType>
      ) => (
        <TransactionsWrapper>
          {transactions.map(tx => {
            return 'hash' in tx ? (
              <TransactionListItem
                key={tx.hash}
                transaction={tx}
                coin={coin}
                coinTicker={coinTicker}
                currency={currency}
              />
            ) : 'pair' in tx ? (
              <SimpleBuyListItem order={tx} />
            ) : (
              <FiatTxListItem tx={tx} />
            )
          })}
        </TransactionsWrapper>
      ),
      Failure: message => (
        <DataError onClick={this.props.onArchive} message={message} />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

export type Props = {
  coin: CoinType
  coinTicker: string
  currency: FiatType
  data: RemoteDataType<
    { message: string },
    Array<SBOrderType | ProcessedTxType>
  >
  onArchive: (address: string) => void
  onLoadMore: () => void
  onRefresh: () => void
  sourceType?: string
}

export default TransactionList
