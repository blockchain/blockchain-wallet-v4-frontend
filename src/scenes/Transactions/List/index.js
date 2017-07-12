import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { selectors, actions } from 'data'
import TransactionList from './template.js'

const txsPerPage = 50

class TransactionListContainer extends React.Component {
  componentWillReceiveProps (nextProps) {
    let shouldRefresh = false

    if (this.props.address !== nextProps.address) {
      this.props.actions.setAddressFilter(nextProps.address)
      shouldRefresh = true
    }
    if (this.props.status !== nextProps.status) {
      this.props.actions.setTypeFilter(nextProps.status)
      shouldRefresh = true
    }
    if (this.props.search !== nextProps.search) {
      this.props.actions.setSearchFilter(nextProps.search)
      shouldRefresh = true
    }

    if (shouldRefresh) {
      this.props.actions.fetchTransactions(this.props.address, txsPerPage)
    }
  }

  render () {
    return (
      <TransactionList transactions={this.props.transactions} />
    )
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('transactionForm')
  return {
    address: selector(state, 'address'),
    status: selector(state, 'status'),
    search: selector(state, 'search'),
    transactions: selectors.core.common.getWalletTransactions(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionListContainer)
