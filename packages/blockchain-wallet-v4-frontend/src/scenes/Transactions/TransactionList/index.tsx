import {
  CoinType,
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

import CustodialTx from '../CustodialTx'
import Loading from './template.loading'
import NonCustodialTx from '../NonCustodialTx'
import SBOrderTx from '../SBOrderTx'

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

class TransactionList extends PureComponent<Props & { onRefresh: () => void }> {
  render () {
    const { coin, currency, data } = this.props

    return data.cata({
      Success: (transactions: SuccessStateType) => (
        <TransactionsWrapper>
          {transactions.map(tx => {
            return 'hash' in tx ? (
              <NonCustodialTx
                key={tx.hash}
                transaction={tx}
                coin={coin as CoinType}
                currency={currency}
              />
            ) : 'pair' in tx ? (
              <SBOrderTx order={tx} />
            ) : (
              <CustodialTx
                tx={tx}
                {...this.props}
                currency={currency as WalletCurrencyType}
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
  currency: FiatType
  data: RemoteDataType<
    { message: string },
    Array<SBOrderType | ProcessedTxType>
  >
  sourceType?: string
}

export type SuccessStateType = Array<
  SBOrderType | SBTransactionType | ProcessedTxType
>

export default TransactionList
