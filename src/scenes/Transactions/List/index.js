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
    if (this.props.address !== nextProps.address) {
      const address = nextProps.address ? nextProps.address : ''
      this.props.actions.setAddressFilter(address)
      this.props.actions.fetchTransactions(this.props.address, txsPerPage)
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
