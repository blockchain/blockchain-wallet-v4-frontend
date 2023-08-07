import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { IngestedSelfCustodyType } from '@core/network/api/coin/types'
import {
  BSOrderType,
  BSTransactionType,
  CoinType,
  FiatBSAndSwapTransactionType,
  FiatType,
  ProcessedTxType,
  RemoteDataType,
  WalletCurrencyType
} from '@core/types'
import DataError from 'components/DataError'

import BuySellListItem from '../BSOrderTx'
import CustodialTxListItem from '../CustodialTx'
import NonCustodialTxListItem from '../NonCustodialTx'
import SelfCustodyTx from '../SelfCustodyTx'
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
      Loading: () => (
        <TransactionsWrapper>
          <Loading />
        </TransactionsWrapper>
      ),
      NotAsked: () => (
        <TransactionsWrapper>
          <Loading />
        </TransactionsWrapper>
      ),
      Success: (transactions: SuccessStateType) => (
        <TransactionsWrapper>
          {transactions.map((tx) => {
            // @ts-ignore
            return 'processingErrorType' in tx ? null : 'hash' in tx ? (
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
              <BuySellListItem key={tx.id} order={tx} />
            ) : 'movements' in tx ? (
              <SelfCustodyTx key={tx.txId} tx={tx} />
            ) : (
              <CustodialTxListItem
                key={tx.id}
                tx={tx as FiatBSAndSwapTransactionType}
                coin={coin}
                currency={currency}
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
  data: RemoteDataType<{ message: string }, Array<BSOrderType | ProcessedTxType>>
  onArchive: (address: string) => void
  onLoadMore: () => void
  onRefresh: () => void
  sourceType?: string
}

export type SuccessStateType = Array<
  BSOrderType | BSTransactionType | ProcessedTxType | IngestedSelfCustodyType
>

export default TransactionList
