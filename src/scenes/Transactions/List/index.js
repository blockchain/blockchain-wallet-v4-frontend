import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { equals } from 'ramda'

import { selectors, actions } from 'data'
import TransactionList from './template.js'

const txsPerPage = 50

class TransactionListContainer extends React.Component {
  constructor (props) {
    super(props)
    if (!props.transactions || props.transactions.length === 0) {
      props.actions.fetchTransactions(props.address, txsPerPage)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.source, nextProps.source)) {
      const source = nextProps.source ? (nextProps.source.xpub ? nextProps.source.xpub : nextProps.source.address) : ''
      this.props.actions.setAddressFilter(source)
      this.props.actions.fetchTransactions(source, txsPerPage)
    }
    if (this.props.status !== nextProps.status) {
      const status = nextProps.status ? nextProps.status : ''
      this.props.actions.setTypeFilter(status)
    }
    if (this.props.search !== nextProps.search) {
      const search = nextProps.search ? nextProps.search : ''
      this.props.actions.setSearchFilter(search)
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
    source: selector(state, 'source'),
    status: selector(state, 'status'),
    search: selector(state, 'search'),
    transactions: selectors.core.common.getWalletTransactions(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionListContainer)
