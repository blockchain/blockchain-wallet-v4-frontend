import {
  FiatType,
  ProcessedTxType,
  RemoteDataType,
  SBOrderType,
  SBTransactionType,
  WalletCurrencyType
} from 'core/types'
import DataError from 'components/DataError'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import CustodialTxListItem from '../CustodialTx'
import Loading from './template.loading'
import SimpleBuyListItem from '../SBOrderTx'
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
      Success: (transactions: SuccessStateType) => (
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
              <CustodialTxListItem tx={tx} {...this.props} />
            )
          })}
        </TransactionsWrapper>
      ),
      Failure: message => (
        <DataError onClick={this.props.onRefresh} message={message} />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

export type Props = {
  coin: WalletCurrencyType
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

export type SuccessStateType = Array<
  SBOrderType | SBTransactionType | ProcessedTxType
>

export default TransactionList
