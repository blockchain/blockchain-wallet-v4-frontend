import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import Transactions from './template.js'

// this should be part of processTransaction selector
const type = (number) => {
  switch (true) {
    case number > 0:
      return 'Received'
    case number === 0:
      return 'Transferred'
    case number < 0:
      return 'Sent'
    default:
      return 'Unknown'
  }
}

// simple version of process transaction
const transformTx = (tx) => ({
  double_spend: tx.double_spend,
  hash: tx.hash,
  amount: tx.result,
  type: type(tx.result),
  description: null,
  from: tx.inputs[0].prev_out.addr,
  to: tx.out[0].addr,
  initial_value: '£1.01',
  time: (new Date(tx.time * 1000)).toString(),
  status: 'confirmed'
})

class TransactionsContainer extends React.Component {
  render () {
    let transactions = this.props.transactions.map(transformTx)
    return (
      <Transactions transactions={transactions} />
    )
  }
}

function mapStateToProps (state) {
  return {
    transactions: selectors.core.transactions.getTransactions(state)
  }
}

export default connect(mapStateToProps)(TransactionsContainer)
