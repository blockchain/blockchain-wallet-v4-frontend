import React from 'react'
import UnifiedActivityTx from 'blockchain-wallet-v4-frontend/src/scenes/Transactions/UnifiedActivityTx'

import { FiatBSAndSwapTransactionType } from '@core/types'
import { useCoinConfig, useCurrency } from 'hooks'

import BuySellListItem from '../../../Transactions/BSOrderTx'
import CustodialTxListItem from '../../../Transactions/CustodialTx'
import NonCustodialTxListItem from '../../../Transactions/NonCustodialTx'
import SelfCustodyTx from '../../../Transactions/SelfCustodyTx'
import SwapOrderTx from '../../../Transactions/SwapOrderTx'
import { TransactionListItemComponent } from './TransactionListItem.types'

const TransactionListItem: TransactionListItemComponent = ({ coin, transaction }) => {
  const currency = useCurrency()

  const { data: coinfig } = useCoinConfig({
    coin
  })

  if (!coinfig) return null

  return 'processingErrorType' in transaction ? null : 'hash' in transaction ? (
    <NonCustodialTxListItem
      key={transaction.hash}
      transaction={transaction}
      coin={coin}
      coinTicker={coinfig?.symbol}
      currency={currency}
    />
  ) : 'priceFunnel' in transaction ? (
    <SwapOrderTx key='transaction.id' order={transaction} coin={coin} />
  ) : 'pair' in transaction ? (
    <BuySellListItem key={transaction.id} order={transaction} />
  ) : 'movements' in transaction ? (
    <SelfCustodyTx coin={coin} key={transaction.txId} tx={transaction} />
  ) : 'detail' in transaction ? (
    <UnifiedActivityTx tx={transaction} coin={coin} />
  ) : (
    <CustodialTxListItem
      key={transaction.id}
      tx={transaction as FiatBSAndSwapTransactionType}
      coin={coin}
      currency={currency}
    />
  )
}

export default TransactionListItem
