import React, { PureComponent } from 'react'
import styled from 'styled-components'

import {
  CoinType,
  FiatSBAndSwapTransactionType,
  FiatType,
  ProcessedTxType,
  RemoteDataType,
  SBOrderType,
  SBTransactionType,
  WalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'

import CustodialTxListItem from '../CustodialTx'
import NonCustodialTxListItem from '../NonCustodialTx'
import SimpleBuyListItem from '../SBOrderTx'
import SwapOrderTx from '../SwapOrderTx'
import Loading from './template.loading'

// width: 99%; to prevent scrolling weirdness
const TransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 99%;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.grey000};
`

class TransactionList extends PureComponent<Props> {
  render() {
    const { coin, coinTicker, currency, data } = this.props

    return data.cata({
      Failure: (message) => <DataError onClick={this.props.onRefresh} message={message} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (transactions: SuccessStateType) => (
        <TransactionsWrapper>
          {transactions.map((tx) => {
            // @ts-ignore
            return 'hash' in tx ? (
              <NonCustodialTxListItem
                key={tx.hash}
                transaction={tx}
                coin={coin as CoinType}
                coinTicker={coinTicker}
                currency={currency}
              />
            ) : 'priceFunnel' in tx ? (
              // @ts-ignore
              <SwapOrderTx key={tx.id} order={tx} coin={coin as CoinType} />
            ) : 'pair' in tx ? (
              <SimpleBuyListItem key={tx.id} order={tx} />
            ) : (
              <CustodialTxListItem
                key={tx.id}
                tx={tx as FiatSBAndSwapTransactionType}
                {...this.props}
              />
            )
          })}
        </TransactionsWrapper>
      )
    })
  }
}

export type Props = {
  coin: WalletCurrencyType
  coinTicker: string
  currency: FiatType
  data: RemoteDataType<{ message: string }, Array<SBOrderType | ProcessedTxType>>
  onArchive: (address: string) => void
  onLoadMore: () => void
  onRefresh: () => void
  sourceType?: string
}

export type SuccessStateType = Array<SBOrderType | SBTransactionType | ProcessedTxType>

export default TransactionList
