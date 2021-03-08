import React, { PureComponent } from 'react'
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
import styled from 'styled-components'

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
  border: 1px solid ${props => props.theme.grey000};
`

class TransactionList extends PureComponent<Props> {
  render () {
    const { coin, coinTicker, currency, data } = this.props

    return data.cata({
      Success: (transactions: SuccessStateType) => (
        <TransactionsWrapper>
          {transactions.map(tx => {
            return 'hash' in tx ? (
              <NonCustodialTxListItem
                key={tx.hash}
                transaction={tx}
                coin={coin as CoinType}
                coinTicker={coinTicker}
                currency={currency}
              />
            ) : 'priceFunnel' in tx ? (
              <SwapOrderTx order={tx} coin={coin as CoinType} />
            ) : 'pair' in tx ? (
              <SimpleBuyListItem order={tx} />
            ) : (
              <CustodialTxListItem
                tx={tx as FiatSBAndSwapTransactionType}
                {...this.props}
              />
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
