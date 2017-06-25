import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import TransactionList from './template.js'

class TransactionListContainer extends React.Component {
  render () {
    return (
      <TransactionList transactions={this.props.transactions} />
    )
  }
}

function mapStateToProps (state) {
  return {
    transactions: selectors.core.common.getWalletTransactions(state)
  }
}

export default connect(mapStateToProps)(TransactionListContainer)
