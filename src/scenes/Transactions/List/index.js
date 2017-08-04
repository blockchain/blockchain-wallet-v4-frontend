import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { equals } from 'ramda'

import { selectors, actions } from 'data'
import List from './template.js'

const nbTransactionsPerRequest = 50
const minTransactionsPerPage = 10
const threshold = 250

class ListContainer extends React.Component {
  constructor (props) {
    super(props)
    this.nbTransactionsFiltered = 0
    this.nbTransactionsFetched = 0
    this.fetchTransactions = this.fetchTransactions.bind(this)
  }

  componentWillMount () {
    if (!this.props.transactions || this.props.transactions.length === 0 || this.props.scroll.yMax === 0) {
      console.log('initial fetch of transactions')
      this.fetchTransactions()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.transactionSource, nextProps.transactionSource)) {
      this.props.actions.setAddressFilter(nextProps.transactionSource)
      this.fetchTransactions(nextProps.transactionSource)
    }

    if (!equals(this.props.status, nextProps.status)) {
      const status = nextProps.status ? nextProps.status : ''
      this.props.actions.setTypeFilter(status)
    }

    if (!equals(this.props.search, nextProps.search)) {
      const search = nextProps.search ? nextProps.search : ''
      this.props.actions.setSearchFilter(search)
    }

    if (!equals(this.props.scroll.yOffset, nextProps.scroll.yOffset)) {
      if (nextProps.scroll.yMax - nextProps.scroll.yOffset < threshold) {
        this.fetchTransactions(nextProps.transactionSource)
      }
    }
  }

  fetchTransactions () {
    console.log('fetchTransactions')
    this.props.actions.fetchTransactions(this.props.applicationSource, nbTransactionsPerRequest)
    this.nbTransactionsFetched += nbTransactionsPerRequest
    this.nbTransactionsFiltered = this.props.transactions.length
    console.log(this.nbTransactionsFetched, this.nbTransactionsFiltered)

    // while (this.nbTransactionsFiltered < minTransactionsPerPage || this.nbTransactionsFetched < this.props.totalTransactions) {
    //   console.log('fetchMore')
    //   this.fetchTransactions()
    // }
  }

  render () {
    return (
      <List transactions={this.props.transactions} />
    )
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('transactionForm')
  const source = selector(state, 'source')

  return {
    source,
    transactionSource: source ? (source.xpub ? source.xpub : source.address) : '',
    status: selector(state, 'status'),
    search: selector(state, 'search'),
    transactions: selectors.core.common.getWalletTransactions(state),
    totalTransactions: selectors.core.info.getNumberTransactions(state),
    scroll: selectors.scroll.selectScroll(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ListContainer)
